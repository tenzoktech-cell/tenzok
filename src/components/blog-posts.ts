import type { BlogPost } from "./blog-types";

/**
 * Blog posts.
 *
 * These were drafted in-house and fact-checked before publishing. If you edit a
 * post, keep the slug stable — it is the URL, and changing it drops whatever
 * search ranking the page has earned.
 */
export const POSTS: BlogPost[] = [
  {
    "slug": "final-year-ml-project-data-leakage",
    "title": "98% Accuracy? Your Final-Year ML Project Has Data Leakage",
    "excerpt": "A 98% accuracy score on a real-world dataset is almost never a good model — it is a leak, and here are the four that cause it.",
    "description": "If your final-year ML project reports 98% accuracy, it is almost certainly data leakage. The four leaks that cause it, how to detect each, and the sklearn fix.",
    "keywords": [
      "why is my model accuracy so high",
      "data leakage machine learning",
      "final year machine learning project",
      "smote before train test split",
      "sklearn pipeline data leakage",
      "target leakage detection",
      "stratifiedgroupkfold",
      "smotenc categorical smote"
    ],
    "publishedAt": "2026-05-26",
    "readingMinutes": 11,
    "tags": [
      "Machine Learning",
      "Final Year Projects",
      "scikit-learn",
      "Data Leakage"
    ],
    "body": [
      {
        "type": "p",
        "text": "You trained the model, printed the score, and got 0.98. The first feeling is relief. The second, if you have been at this long enough, is doubt. If you are searching why is my model accuracy so high, the uncomfortable answer is that a final-year ML project reporting 98% accuracy on a real-world dataset is almost always suffering from data leakage: the test set has already told the model something it was never supposed to know. Leakage is not exotic, and it is not a subtle statistical failure that only researchers hit. It is a few lines of completely ordinary code, written in the order most tutorials teach them, and it will survive every sanity check you know how to run precisely because your accuracy looks great. Leakage does not throw an exception. It hands you a beautiful number and lets you put it on a slide."
      },
      {
        "type": "p",
        "text": "This post shows the four leaks that kill student machine learning projects, the wrong code and the right code for each, how to detect them in a dataset you did not create, and the pipeline pattern that makes all four structurally impossible. It also shows, with numbers, where the most popular leak-detection trick on the internet quietly fails."
      },
      {
        "type": "p",
        "text": "Every number printed in this post came from actually running the code, on scikit-learn 1.9.0 and imbalanced-learn 0.14.2. The blocks are sequential and share one Python session: names defined in an earlier block are still live in a later one, so run them in order."
      },
      {
        "type": "h2",
        "text": "What data leakage actually is"
      },
      {
        "type": "p",
        "text": "Data leakage is any path by which information from your evaluation set reaches your model before evaluation. That is broader than it sounds. It does not require copying rows. A shared mean, a synthetic sample interpolated between a train point and a test point, a second scan of the same patient, a column recorded after the outcome was already known: all of these are paths. The reason it is so destructive is that it inflates exactly the metric you use to decide you are done. A leaking model is not a good model that happened to get lucky on the test split. It is a model whose reported score measures memorisation, and whose real score you have never seen."
      },
      {
        "type": "h2",
        "text": "Leak 1: you split after SMOTE"
      },
      {
        "type": "p",
        "text": "This is the leak I see most often, because every imbalanced-data tutorial applies SMOTE to the whole dataframe and only then splits. To show what it is worth on its own, run it against a dataset that contains no signal whatsoever: the features are pure Gaussian noise, the labels are coin flips, there is nothing to learn. Note that the scaler is inside a pipeline and the evaluation is 5-fold cross-validation in both versions below, so the only thing that changes between them is when SMOTE runs."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom imblearn.over_sampling import SMOTE\nfrom imblearn.pipeline import Pipeline as ImbPipeline\n\nrng = np.random.default_rng(0)\nX = rng.normal(size=(400, 40))              # 40 columns of pure noise\ny = (rng.random(400) < 0.15).astype(int)    # 15% positives, unrelated to X\n\ncv  = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\nclf = RandomForestClassifier(n_estimators=300, random_state=0)\n\n# THE BUG: resample the whole dataset, then cross-validate whatever comes out.\nX_res, y_res = SMOTE(random_state=0).fit_resample(X, y)\n\nleaky = Pipeline([(\"scale\", StandardScaler()), (\"clf\", clf)])\nauc = cross_val_score(leaky, X_res, y_res, cv=cv, scoring=\"roc_auc\")\nacc = cross_val_score(leaky, X_res, y_res, cv=cv, scoring=\"accuracy\")\nprint(auc.mean().round(3), auc.std().round(3))   # 0.988 0.007\nprint(acc.mean().round(3))                       # 0.961"
      },
      {
        "type": "p",
        "text": "0.988 AUC and 96.1% accuracy on data that contains zero information. This code produces 96% on noise. The mechanism: SMOTE creates synthetic minority points by interpolating between a real minority point and one of its k nearest neighbours. Run it before the split and a synthetic point built from row 12 can land in the validation fold while row 12 itself sits in training. The forest does not generalise. It looks up the answer."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "honest = ImbPipeline([\n    (\"scale\", StandardScaler()),\n    (\"smote\", SMOTE(random_state=0)),   # now resampling happens inside each fold\n    (\"clf\",   clf),\n])\n\nauc = cross_val_score(honest, X, y, cv=cv, scoring=\"roc_auc\")\nprint(auc.mean().round(3), auc.std().round(3))   # 0.533 0.063"
      },
      {
        "type": "p",
        "text": "0.533. Chance, which is the correct answer for noise. Same data, same model, same SMOTE, same scaler, same folds, same seed. The only thing that moved is when the resampling happened, and it is worth 0.45 AUC of pure fiction."
      },
      {
        "type": "callout",
        "tone": "note",
        "text": "Use imblearn's Pipeline, not sklearn's, whenever a sampler is in the chain. imblearn's version applies samplers during fit only and skips them at predict time, which is exactly what you want: oversample the training fold, score the untouched validation fold. Hand a sampler to sklearn's Pipeline and it raises TypeError, because a sampler has no transform method. That is an honest failure, and it is the reason you cannot accidentally do the right thing with the wrong Pipeline."
      },
      {
        "type": "h2",
        "text": "Leak 2: you fit the scaler on the full dataset"
      },
      {
        "type": "p",
        "text": "Quieter, and common in published notebooks. The leak is that fit_transform on the whole matrix computes the mean and standard deviation of every column using the test rows, then bakes those statistics into the training data. Your model is trained on a representation that already knows the test set's distribution."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "from sklearn.model_selection import train_test_split\n\n# WRONG: the scaler sees every row before the split\nscaler = StandardScaler()\nX_all  = scaler.fit_transform(X)          # mean and std computed over test rows too\nX_tr, X_te, y_tr, y_te = train_test_split(X_all, y, test_size=0.2, random_state=0)\n\n# RIGHT: fit on train, transform both\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)\nscaler = StandardScaler().fit(X_tr)       # fit on train only\nX_tr   = scaler.transform(X_tr)\nX_te   = scaler.transform(X_te)           # transform. never fit."
      },
      {
        "type": "p",
        "text": "With a plain StandardScaler this leak is usually worth a point or two of accuracy, not thirty. It is dangerous because it rarely arrives alone, and because the same mistake with a transformer that looks at y is devastating. Fit SelectKBest on all 400 rows of a 5000-column noise matrix and the resulting model scores above 0.8 AUC on noise, by itself. The rule has no exceptions: a transformer may only ever call fit on training data. Anything that learns from data and runs before the split is a leak."
      },
      {
        "type": "ul",
        "items": [
          "SelectKBest or any feature selection fitted on all rows. This one is brutal, because the selector reads the labels.",
          "Target or mean encoding of a categorical column computed over the whole dataframe. This encodes the label directly.",
          "SimpleImputer or KNNImputer filling missing values using the global median.",
          "PCA or any dimensionality reduction fitted before the split.",
          "TfidfVectorizer fitted on train plus test documents. The IDF weights are learned from the corpus.",
          "Any manual df.col.fillna(df.col.mean()) written before the split. Same bug, no library to blame."
        ]
      },
      {
        "type": "h2",
        "text": "Leak 3: you split rows when you should have split patients"
      },
      {
        "type": "p",
        "text": "This is the leak that ruins medical imaging, audio, sensor and video projects, and it is the one students defend hardest, because the split looks correct. You have 1920 visits from 240 patients, eight visits each. You call train_test_split. No row appears in both sets. It still leaks, because the model does not need the same row twice. It only needs another row from the same person. Here is a cohort where age, bmi, sex and site are patient attributes, so they repeat identically across that patient's eight visits, and where the outcome is a genuine but noisy function of them."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import pandas as pd\n\nrng = np.random.default_rng(1)\nn_pat, per_pat = 240, 8\nn   = n_pat * per_pat\npid = np.repeat(np.arange(n_pat), per_pat)      # 8 visits per patient\n\nage_p  = rng.normal(58, 12, n_pat).round(0)     # patient-level attributes:\nbmi_p  = rng.normal(27, 4.5, n_pat).round(1)    # constant across that patient's visits\nsbp_p  = rng.normal(130, 15, n_pat)\nsex_p  = rng.choice([\"F\", \"M\"], n_pat)\nsite_p = rng.choice([\"A\", \"B\", \"C\"], n_pat)\n\n# the outcome is a real, noisy function of patient-level risk\nlogit   = -2.0 + 0.08*(age_p-58) + 0.26*(bmi_p-27) + 1.0*(sex_p==\"M\") + 0.05*(sbp_p-130)\nlabel_p = (rng.random(n_pat) < 1/(1+np.exp(-logit))).astype(int)\n\ny  = pd.Series(label_p[pid], name=\"relapse\")   # the label is a property of the PATIENT\ndf = pd.DataFrame({\n    \"patient_id\": pid,\n    \"age\":  age_p[pid],\n    \"bmi\":  bmi_p[pid],\n    \"sbp\": (sbp_p[pid] + rng.normal(0, 6, n)).round(1),   # varies per visit\n    \"sex\":  sex_p[pid],\n    \"site\": site_p[pid],\n})\n# a follow-up is scheduled BECAUSE of the outcome (we will come back to this)\ndf[\"days_to_followup\"] = np.where(y == 1, rng.normal(10, 2, n), rng.normal(88, 6, n)).round(1)\ndf[\"relapse_note_len\"] = np.where(y == 1, rng.normal(240, 40, n).round(0), np.nan)\ndf.loc[rng.random(n) < 0.05, \"bmi\"] = np.nan   # realistic missingness\n\nprint(len(df), df[\"patient_id\"].nunique(), round(y.mean(), 3))   # 1920 240 0.221"
      },
      {
        "type": "p",
        "text": "Because a patient's age and bmi are identical on all eight of their visits, those columns are a fingerprint. A tree only has to recognise the person to recover their label. That is exactly what an augmented crop, a second slice, or a five-second window of the same recording gives a model in real data."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "from sklearn.model_selection import StratifiedGroupKFold\nfrom sklearn.metrics import roc_auc_score\n\nXd = pd.get_dummies(df[[\"age\", \"bmi\", \"sbp\", \"sex\", \"site\"]], columns=[\"sex\", \"site\"])\nXd[\"bmi\"] = Xd[\"bmi\"].fillna(Xd[\"bmi\"].median())\n\n# WRONG: random row split. the same patient lands in train AND in test.\nX_tr, X_te, y_tr, y_te = train_test_split(Xd, y, test_size=0.2, stratify=y, random_state=0)\nm = RandomForestClassifier(n_estimators=300, random_state=0).fit(X_tr, y_tr)\nprint(round(roc_auc_score(y_te, m.predict_proba(X_te)[:, 1]), 3))   # 0.997\n\n# RIGHT: the patient is the unit. no patient may cross the boundary.\nsgkf = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=0)\ns = cross_val_score(RandomForestClassifier(n_estimators=300, random_state=0),\n                    Xd, y, groups=df[\"patient_id\"], cv=sgkf, scoring=\"roc_auc\")\nprint(s.mean().round(3), s.std().round(3))                          # 0.688 0.119"
      },
      {
        "type": "p",
        "text": "0.997 against 0.688. The signal in this cohort is real, so the honest number is not chance, it is just far lower than the leak suggested. That is the shape of the damage: leakage does not invent a model out of nothing, it inflates a mediocre one into a triumphant one. Use GroupShuffleSplit for a single held-out split, StratifiedGroupKFold when you also need class balance preserved, and pass the group vector through the groups argument every single time."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "If you augment, augment after the split, inside the training fold only. Rotating an image and letting the rotated copy land in validation is the same leak wearing a different hat. The same applies to oversampling by duplicating minority rows: the duplicate must never be able to cross the boundary."
      },
      {
        "type": "h2",
        "text": "Leak 4: a column that already contains the answer"
      },
      {
        "type": "p",
        "text": "Target leakage is when a feature was recorded after, or because of, the outcome you are predicting. Predicting readmission with a discharge_summary_length column. Predicting default with a recovery_agent_assigned flag. Predicting churn with a cancellation_reason that is null for everyone who stayed. The model is not wrong to use it, your dataset is wrong to contain it. You will not find this on a correlation heatmap. Score every numeric column against the label on its own and read the ranking: a single raw column that separates the classes almost perfectly is not a feature, it is a confession."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "def leak_scan(X: pd.DataFrame, y: pd.Series) -> pd.Series:\n    \"\"\"AUC of every numeric column, on its own, against the target.\"\"\"\n    scores = {}\n    for col in X.select_dtypes(include=\"number\").columns:\n        v  = X[col]\n        ok = v.notna()\n        # a column that is null for one whole class leaves a single class here,\n        # and roc_auc_score raises ValueError. that column is the loudest leak\n        # in the table, so record it rather than crashing on it.\n        if ok.sum() == 0 or y[ok].nunique() < 2:\n            scores[col] = np.nan\n            continue\n        auc = roc_auc_score(y[ok], v[ok])\n        scores[col] = max(auc, 1 - auc)   # a column can predict either direction\n    return pd.Series(scores).sort_values(ascending=False)\n\nprint(leak_scan(df.drop(columns=[\"patient_id\"]), y).round(3).to_string())\n# days_to_followup    1.000    <- the label in disguise\n# bmi                 0.757    <- a real predictor. this is what signal looks like\n# sbp                 0.667\n# age                 0.639\n# relapse_note_len      NaN    <- null for every negative. guarded, not scored"
      },
      {
        "type": "p",
        "text": "Read the two extremes. days_to_followup scores a perfect 1.000, because the follow-up was scheduled as a consequence of the relapse. relapse_note_len cannot be scored at all: it is null for every patient who did not relapse, so once you drop the nulls only one class survives. The naive version of this function raises ValueError there, which means the check breaks on the most blatant leak in the table. And bmi at 0.757 is the control: a genuinely predictive column, high but not absurd. Any column above roughly 0.90 deserves an interrogation, and the question is always the same. At the moment I would have to make this prediction in production, would this value exist yet? If not, drop the column. Do not scale it, do not regularise it away, drop it."
      },
      {
        "type": "h2",
        "text": "The pattern that makes all four leaks impossible"
      },
      {
        "type": "p",
        "text": "Do not fix leaks one at a time. Restructure the code so they cannot be expressed. Every fit-based step goes inside one estimator, that estimator is the only object that ever touches data, and the splitter is group-aware. This is the template I would actually write."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "from sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OrdinalEncoder\nfrom sklearn.model_selection import cross_validate\nfrom imblearn.over_sampling import SMOTENC\n\nnum = [\"age\", \"bmi\", \"sbp\"]\ncat = [\"sex\", \"site\"]\n# note: days_to_followup and relapse_note_len are deliberately NOT here.\n\nprep = ColumnTransformer([\n    (\"num\", Pipeline([(\"impute\", SimpleImputer(strategy=\"median\")),\n                      (\"scale\",  StandardScaler())]), num),\n    (\"cat\", Pipeline([(\"impute\", SimpleImputer(strategy=\"most_frequent\")),\n                      (\"ord\",    OrdinalEncoder(handle_unknown=\"use_encoded_value\",\n                                                unknown_value=-1))]), cat),\n])\ncat_idx = list(range(len(num), len(num) + len(cat)))   # [3, 4] after the transformer\n\npipe = ImbPipeline([\n    (\"prep\",  prep),                                            # fitted per fold\n    (\"smote\", SMOTENC(categorical_features=cat_idx, random_state=0)),  # training fold only\n    (\"clf\",   RandomForestClassifier(n_estimators=300, random_state=0)),\n])\n\ncv  = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=0)\nres = cross_validate(pipe, df, y, groups=df[\"patient_id\"], cv=cv,\n                     scoring=[\"roc_auc\", \"average_precision\", \"balanced_accuracy\"],\n                     return_train_score=True)\n\nprint(res[\"test_roc_auc\"].mean().round(3), res[\"test_roc_auc\"].std().round(3))  # 0.691 0.123\nprint(res[\"train_roc_auc\"].mean().round(3))                                     # 1.0\nprint(res[\"test_average_precision\"].mean().round(3))                            # 0.385\nprint(res[\"test_balanced_accuracy\"].mean().round(3))                            # 0.569"
      },
      {
        "type": "p",
        "text": "Note what this buys. The imputer's median is recomputed on four folds and applied to the fifth. The scaler never sees a validation row. The sampler runs on the training fold and is skipped at predict time. No patient crosses a fold boundary. And return_train_score hands you the gap for free: a train AUC of 1.0 against a test AUC of 0.691 is a forest memorising its training fold, which is overfitting rather than leakage, but it is a different disease worth seeing on the same line."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "SMOTENC, not SMOTE, the moment you have categorical columns. SMOTE interpolates between neighbours, so if you feed it one-hot columns it will happily produce fractional categories. Swap SMOTENC for OneHotEncoder plus SMOTE on this exact cohort and 383 of the 1072 synthetic rows, 35.7% of them, come out with fractional one-hot values: site vectors like [0.475, 0.0, 0.525], a patient who is 47% site A and 53% site C. SMOTENC exists precisely for mixed numeric and categorical data, and it resamples the categorical block by majority vote among neighbours instead of averaging it into nonsense."
      },
      {
        "type": "h2",
        "text": "Three checks to run before you believe any number"
      },
      {
        "type": "h3",
        "text": "1. Shuffle the labels, at the level the label actually lives at"
      },
      {
        "type": "p",
        "text": "Permute y, keep X, rerun the exact evaluation you plan to report. A correct pipeline must collapse to chance. Here is the part almost every version of this advice gets wrong: if the label is a property of the group, you must permute it at the group level. Shuffling row by row breaks the within-patient constancy of the label, which destroys the very structure the group leak exploits, and the leaky pipeline then reports a clean 0.5 while still being catastrophically broken. Take one label per patient, permute those, broadcast back."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "def group_shuffle_null(pipe, df, y, groups, cv, n_repeats=10):\n    \"\"\"Permute the label at the GROUP level, then re-run the evaluation.\"\"\"\n    lab = y.groupby(groups).first()          # one label per patient\n    out = []\n    for seed in range(n_repeats):\n        r      = np.random.default_rng(seed)\n        perm   = pd.Series(r.permutation(lab.to_numpy()), index=lab.index)\n        y_null = groups.map(perm)            # broadcast back to all 8 visits\n        out.append(cross_val_score(pipe, df, y_null, groups=groups,\n                                   cv=cv, scoring=\"roc_auc\").mean())\n    return np.array(out)\n\nnull = group_shuffle_null(pipe, df, y, df[\"patient_id\"], cv)\nprint(null.mean().round(3), null.std().round(3))   # 0.505 0.039  <- correct pipeline\n\n# now feed the SAME group-permuted labels to the LEAKY row-split evaluation\nlab    = y.groupby(df[\"patient_id\"]).first()\nr      = np.random.default_rng(0)\ny_null = df[\"patient_id\"].map(pd.Series(r.permutation(lab.to_numpy()), index=lab.index))\n\na, b, c, d = train_test_split(Xd, y_null, test_size=0.2, stratify=y_null, random_state=0)\nmm = RandomForestClassifier(n_estimators=300, random_state=0).fit(a, c)\nprint(round(roc_auc_score(d, mm.predict_proba(b)[:, 1]), 3))   # 0.984  <- leak exposed\n\n# and the row-wise shuffle everyone recommends, on the same leaky evaluation:\nr       = np.random.default_rng(0)\ny_rowsh = pd.Series(r.permutation(y.to_numpy()), index=y.index)\na, b, c, d = train_test_split(Xd, y_rowsh, test_size=0.2, stratify=y_rowsh, random_state=0)\nmm = RandomForestClassifier(n_estimators=300, random_state=0).fit(a, c)\nprint(round(roc_auc_score(d, mm.predict_proba(b)[:, 1]), 3))   # 0.513  <- leak INVISIBLE"
      },
      {
        "type": "p",
        "text": "0.505 for the correct pipeline, which is what a passing check looks like. 0.984 for the leaky row split under a group-level permutation, which is what a failing one looks like. And 0.513 for that same broken pipeline under the row-wise shuffle: a clean bill of health for a model that scores a fraudulent 0.997 on real labels. Repeat the permutation a handful of times and read the mean, because a single draw over 240 patients has enough variance to land near 0.59 by luck alone. Run this check with the same splitter and groups you intend to report."
      },
      {
        "type": "callout",
        "tone": "note",
        "text": "Know what this check cannot see. The label shuffle detects information crossing the split boundary, so it catches Leak 1 and Leak 2. It is blind to Leak 4 by construction: shuffling y destroys the relationship the leaking column has with y, so a target leak reports chance and looks clean. Add days_to_followup back into Xd and re-run the group-aware cross-validation on this cohort and you get 1.000 AUC on the true labels, 0.509 on shuffled ones. No single check finds all four. That is why there are three of them, plus the timeline question."
      },
      {
        "type": "h3",
        "text": "2. Count duplicate rows"
      },
      {
        "type": "p",
        "text": "Call df.duplicated().sum() before you split. The cohort above returns 0, which is the answer you want. Public student datasets, especially the ones circulated on Kaggle and in college repos, are frequently pre-balanced by someone who duplicated the minority class. If they did, a random split puts identical rows on both sides and your accuracy is a lookup table. Deduplicate first, then split, and find out how the file was balanced before you trust it."
      },
      {
        "type": "h3",
        "text": "3. Assert the group boundary"
      },
      {
        "type": "p",
        "text": "Do not trust that your splitter did what you think. Assert it, and leave the assert in the code so the examiner can see it. This is the check that catches Leak 3, and it is three lines."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "from sklearn.model_selection import GroupShuffleSplit\n\ng   = df[\"patient_id\"].to_numpy()\ngss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=0)\ntr, te = next(gss.split(df, y, groups=g))\n\nassert not (set(g[tr]) & set(g[te])), \"patient in both sets\""
      },
      {
        "type": "h2",
        "text": "What the examiner asks, and what an honest number looks like"
      },
      {
        "type": "ol",
        "items": [
          "Show me the line where you split and the line where you resampled. Which one runs first?",
          "What is your class balance? If it is 95/5, what does 96% accuracy prove?",
          "Is your test set a random sample of rows, or of patients, users, sessions, or days?",
          "Which feature has the highest importance, and when in the real timeline is that value recorded?",
          "What happens if I shuffle the labels? At what level did you shuffle them?",
          "What is the variance across your cross-validation folds? One number from one split tells me nothing.",
          "Was the dataset already balanced when you downloaded it, and if so, how?"
        ]
      },
      {
        "type": "p",
        "text": "None of these require reading your model code. Leakage lives in the plumbing, and the plumbing is where an experienced reviewer looks first. So report AUC or average precision rather than accuracy on any imbalanced problem, and report the spread across folds. A mean of 0.69 with a standard deviation of 0.12 across five group-aware folds is a defensible result you can talk about. A single 0.98 from one train_test_split is not a result at all, it is an anecdote, and it is usually an anecdote about your preprocessing order."
      },
      {
        "type": "p",
        "text": "Fixing this makes your project stronger, not weaker. A project that reports 0.69 honestly, shows the leak it found, and demonstrates the shuffled-label control is a substantially better piece of engineering than one that reports 0.98 and cannot survive a follow-up question. The examiner is not grading the number, they are grading whether you know what the number means. That distinction, between a metric that looks good and a system that works, is the first thing we look for when we review a student ML project at Tenzok, and it is worth building the habit long before anyone is grading you for it. Start by running the group-level shuffle on whatever you trained last week."
      }
    ],
    "faq": [
      {
        "q": "Why is my model accuracy so high?",
        "a": "Almost always because information from the test set reached the model during training. The four usual causes are: applying SMOTE or another resampler before the train/test split, fitting a scaler, imputer, or feature selector on the full dataset before splitting, splitting rows at random when many rows belong to the same patient or subject, and including a feature that was recorded after the outcome was known. Work through them in that order. On pure noise, splitting after SMOTE produced 0.988 AUC and 96.1% accuracy, so a suspiciously high score is entirely reproducible with no signal at all."
      },
      {
        "q": "Does SMOTE cause data leakage?",
        "a": "SMOTE itself does not, but applying it before the train/test split does. SMOTE generates synthetic minority samples by interpolating between real samples and their nearest neighbours, so if it runs on the full dataset a synthetic point derived from a training row can land in the test set. Put SMOTE inside an imblearn Pipeline so it only ever runs on the training fold. On a pure-noise dataset, resampling before cross-validation scored 0.988 AUC; moving the identical SMOTE inside the pipeline, with everything else held constant, scored 0.533."
      },
      {
        "q": "Should I use sklearn Pipeline or imblearn Pipeline?",
        "a": "Use imblearn's Pipeline whenever a resampler such as SMOTE, SMOTENC, or RandomUnderSampler is in the chain. It applies samplers during fit only and skips them at predict time, which is the behaviour you want. scikit-learn's own Pipeline rejects samplers with a TypeError because a sampler has no transform method: transform is not allowed to change the number of rows, which is exactly what a sampler does. For scalers, imputers, encoders, and feature selection, sklearn's Pipeline is fine, and imblearn's is a drop-in superset of it."
      },
      {
        "q": "Will shuffling the labels detect every kind of data leakage?",
        "a": "No, and this is the most common misconception about the check. A label shuffle detects information crossing the split boundary, so it catches SMOTE-before-split and transformers fitted on the full dataset. It misses target leakage entirely, because shuffling the labels destroys the relationship the leaking column has with the target: on one cohort, a forest containing a days_to_followup column scored 1.000 AUC on the true labels and 0.509 on shuffled ones, reporting clean. It also misses group leakage unless you permute at the group level. A row-wise shuffle on a leaky row split scored 0.513, hiding a model that reports 0.997 on real labels; permuting one label per patient and broadcasting it back exposed the same leak at 0.984."
      },
      {
        "q": "How do I split a dataset when I have multiple images or visits per patient?",
        "a": "Split on the patient, never on the row. Use GroupShuffleSplit for a single held-out set or StratifiedGroupKFold for cross-validation, passing the patient ID array as the groups argument, and assert afterwards that no group ID appears in both sides. A random row split lets the model recognise the patient rather than the condition: on a cohort of 240 patients with eight visits each, a random row split scored 0.997 AUC while group-aware cross-validation on the same data and model scored 0.688. The 0.688 is the real number."
      }
    ]
  },
  {
    "slug": "mini-project-vs-major-project-scoping",
    "title": "Mini Project vs Major Project: How to Scope a Final Year Build",
    "excerpt": "A mini project is one hard thing done properly in four weeks. A major project is a system. Here is how to scope either one so you can actually finish it — and defend it.",
    "description": "How to choose a final year project you can finish and defend: mini vs major scope, the one-hard-thing rule, a 12-week skeleton, and what to cut when behind.",
    "keywords": [
      "mini project vs major project",
      "how to choose final year project",
      "final year project scope",
      "data leakage train test split",
      "capstone project plan",
      "how to defend final year project",
      "group split by patient sklearn",
      "12 week capstone timeline"
    ],
    "publishedAt": "2026-06-09",
    "readingMinutes": 11,
    "tags": [
      "final year project",
      "capstone",
      "scoping",
      "engineering"
    ],
    "body": [
      {
        "type": "p",
        "text": "Most final year projects do not fail in the last week. They fail in the first week, in the ten minutes where a team picks something that sounds impressive and writes it on a form. Everything after that is a slow discovery of how big the thing actually was. The mini project vs major project question is not really a question about size. It is a question about what you can finish, understand completely, and still defend when someone pushes on it."
      },
      {
        "type": "p",
        "text": "The examiner in your viva has twenty minutes and has already sat through several projects that day. The thing being tested is not whether your idea was ambitious. It is whether you understand the system in front of you: where it breaks, why you chose this over that, and what happens when the input is bad. An unscoped project makes those questions unanswerable, because you never had time to understand any single part of it."
      },
      {
        "type": "p",
        "text": "This post covers the real difference between a mini project and a major project, how to turn a vague department brief into a scoped one, a worked example of narrowing a bad problem statement into a defensible one, a week-by-week skeleton for a 12-week capstone, and the order in which to cut scope when you are behind. You will be behind."
      },
      {
        "type": "h2",
        "text": "What actually separates a mini project from a major project"
      },
      {
        "type": "p",
        "text": "It is not size, and it is definitely not screen count. The difference is structural."
      },
      {
        "type": "ul",
        "items": [
          "A mini project is 3 to 4 weeks. It is one hard thing, done properly. It does not need architecture. It needs a correct implementation of a single non-trivial idea, and you need to be able to explain why it works.",
          "A major project is 10 to 12 weeks. It is a system: two or more components with contracts between them, real data flowing through, state that persists, and something deployed. The hard thing is still there, but now it has to survive contact with the rest of the system."
        ]
      },
      {
        "type": "p",
        "text": "The defense differs the same way. For a mini project, the question is whether it works and whether you know why. For a major project, the question is why it is built this way: why a queue and not a cron job, why Postgres and not a JSON file, why this model and not the simpler one that would have been almost as good."
      },
      {
        "type": "callout",
        "tone": "note",
        "text": "A very common failure mode: a major project that is really a mini project with three CRUD screens and a login page bolted on. The core does one thing, and the rest is padding. The padding is usually where the hardest questions land, because it is the part you understood least and thought about last."
      },
      {
        "type": "h2",
        "text": "The scoping trap: you picked a topic, not a problem"
      },
      {
        "type": "p",
        "text": "This is the most common mistake, and it stays invisible until about week six. Students pick topics. Topics are areas: blockchain in supply chain, AI in agriculture, IoT for smart cities. A topic has no failure condition, which means it has no finish line, which means you can work on it forever and never be done."
      },
      {
        "type": "p",
        "text": "A problem has four things. If you cannot fill in all four, what you have is still a topic:"
      },
      {
        "type": "ul",
        "items": [
          "A user. Someone specific who has this problem. Not \"farmers\" — a farmer standing in a field holding a phone.",
          "A decision. What does this person do differently because your system exists? If nothing changes, the system is decoration.",
          "A cost of being wrong. What does a false positive cost? A false negative? These are not the same, and pretending they are is why so many students end up reporting accuracy on imbalanced data.",
          "A way to check. How do you know it worked, on data the system has never seen, measured the way the real world would measure it?"
        ]
      },
      {
        "type": "p",
        "text": "\"AI in agriculture\" fails all four. \"Detect leaf blight from a phone photo taken in field lighting, so a farmer decides whether to spray this week, where a missed infection costs a crop and a false alarm costs one spray\" passes all four — and now you know exactly what to build and exactly what to measure."
      },
      {
        "type": "h2",
        "text": "How do I turn a vague department brief into a scoped one?"
      },
      {
        "type": "p",
        "text": "Departments hand you one line. \"Machine learning for healthcare.\" \"Web application for campus management.\" Your job is not to complain about it. Your job is to convert it into a contract with yourself, in writing, before you open an editor. Answer these five, in this order:"
      },
      {
        "type": "ol",
        "items": [
          "Who is the user and what decision are they making?",
          "What data actually exists, today, that I can get my hands on this week?",
          "What is the one hard thing here — the part that could genuinely fail?",
          "What is the dumbest possible version that still does the hard thing? That is v1.",
          "What am I explicitly not doing? Write the list. It is the most useful part."
        ]
      },
      {
        "type": "p",
        "text": "Then commit it to the repo as scope.yml and update it whenever reality changes. It is worth more than a Gantt chart: half the viva questions are answered directly out of it, and in week nine, when you are behind and tempted to invent new work, the not_doing list is the thing that stops you."
      },
      {
        "type": "code",
        "lang": "yaml",
        "code": "problem: >\n  Flag diabetic inpatients at high risk of readmission within 30 days,\n  so the discharge planner can schedule a follow-up call before discharge.\n\nuser: hospital discharge planner\ndecision: schedule a follow-up call, or do not\ncost_of_false_negative: patient readmitted, no call was made\ncost_of_false_positive: one wasted 10-minute phone call\n\ndata:\n  source: UCI Diabetes 130-US hospitals (public, ~100k encounters)\n  key_detail: patients repeat across rows; patient_nbr != encounter_id\n  gotcha: missing values are the literal string \"?\", not empty cells\n\none_hard_thing: leakage-free evaluation across repeat patients\n\nv1:\n  - patient-grouped train/test split (no patient in both sides)\n  - 8 features, named and frozen; preprocessing lives in the pipeline\n  - one gradient-boosted model, fitted pipeline persisted with the threshold\n  - threshold chosen from a recall target, not left at 0.5\n  - FastAPI /predict endpoint, deployed, public URL\n\nnot_doing:\n  - no live hospital integration (no HL7, no FHIR)\n  - no fairness audit (too few positives per subgroup to report a stable\n    metric; named as a limitation in the report)\n  - no use of the weight column (empty for almost every encounter)\n  - no explainability dashboard, no mobile app"
      },
      {
        "type": "h2",
        "text": "Worked example: narrowing \"AI for healthcare\" into something defensible"
      },
      {
        "type": "p",
        "text": "Start with the brief as given: AI for healthcare. Useless. Pass one, pick a user and a decision: a discharge planner deciding whether to book a follow-up call. The output is no longer \"insight\", it is a yes or no about a specific patient at a specific moment."
      },
      {
        "type": "p",
        "text": "Pass two, data reality. There is a well-known public dataset of roughly a hundred thousand diabetic hospital encounters. Two facts about it matter more than anything you will read in a paper. First, it has two ID columns: encounter_id identifies a visit, patient_nbr identifies a person, and the same person appears across many rows. Second, missing values are written as the literal string \"?\", so if you read the CSV naively, \"missing\" quietly becomes a first-class category in every column. Run df.isna().mean().sort_values() before you trust anything — you will find that weight is empty for roughly 97 percent of rows, which is why nobody serious uses it as a feature."
      },
      {
        "type": "p",
        "text": "Pass three, find the one hard thing. It is not the model; any gradient-boosting library fits this in three lines. The hard thing is evaluating it honestly, because the obvious split puts the same patient on both sides. Here is the wrong version, which is what a lot of submissions contain:"
      },
      {
        "type": "code",
        "lang": "python",
        "code": "# train_wrong.py -- the split most submissions ship\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv(\"diabetic_data.csv\", na_values=\"?\")\ny = (df[\"readmitted\"] == \"<30\").astype(int)\n\nNUMERIC = [\"time_in_hospital\", \"num_medications\", \"number_inpatient\",\n           \"number_emergency\", \"number_diagnoses\"]\nCATEGORICAL = [\"age\", \"insulin\", \"diabetesMed\"]\nX = df[NUMERIC + CATEGORICAL]\n\n# WRONG: this splits rows, not people. patient_nbr repeats across rows, so one\n# admission by a patient can sit in train while a later admission sits in test.\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42\n)\n\noverlap = (set(df.loc[X_train.index, \"patient_nbr\"])\n           & set(df.loc[X_test.index, \"patient_nbr\"]))\nprint(f\"{len(overlap)} patients appear in BOTH train and test\")"
      },
      {
        "type": "p",
        "text": "The model gets to see a patient's earlier admissions while training and is then scored on their later ones, so it can memorise the person instead of learning the pattern. Your reported score is then partly a measure of memorisation, and you should expect it to be optimistic — how optimistic depends on how many of your encounters are repeat patients, so measure it rather than guessing. Either way you cannot defend the number, and \"did you split by patient or by row?\" is a very easy question for an examiner or an interviewer to ask."
      },
      {
        "type": "p",
        "text": "The fix is two changes, and together they are the spine of the project. Split on people, using GroupShuffleSplit with patient_nbr as the group. And put the preprocessing inside the pipeline, so that the exact transformer fitted on the training data is the object that later runs at inference — otherwise your deployed API and your trained model disagree about what a feature even is, and you will not find out until something returns nonsense."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "# train.py -- complete and standalone. Produces model.joblib.\nimport joblib\nimport numpy as np\nimport pandas as pd\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.ensemble import HistGradientBoostingClassifier\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.metrics import precision_recall_curve, roc_auc_score\nfrom sklearn.model_selection import GroupShuffleSplit\nfrom sklearn.pipeline import Pipeline, make_pipeline\nfrom sklearn.preprocessing import OneHotEncoder\n\nNUMERIC = [\"time_in_hospital\", \"num_medications\", \"number_inpatient\",\n           \"number_emergency\", \"number_diagnoses\"]\nCATEGORICAL = [\"age\", \"insulin\", \"diabetesMed\"]\nCOLUMNS = NUMERIC + CATEGORICAL\n\ndf = pd.read_csv(\"diabetic_data.csv\", na_values=\"?\")\nX = df[COLUMNS]\ny = (df[\"readmitted\"] == \"<30\").astype(int)\ngroups = df[\"patient_nbr\"]\n\n# Split people, not rows.\nsplitter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)\ntrain_idx, test_idx = next(splitter.split(X, y, groups))\nX_train, X_test = X.iloc[train_idx], X.iloc[test_idx]\ny_train, y_test = y.iloc[train_idx], y.iloc[test_idx]\n\n# Preprocessing lives INSIDE the pipeline, so the transformer that was fitted\n# on the training data is the same object that runs at inference.\npipe = Pipeline([\n    (\"prep\", ColumnTransformer([\n        (\"num\", \"passthrough\", NUMERIC),\n        (\"cat\", make_pipeline(\n            SimpleImputer(strategy=\"constant\", fill_value=\"missing\"),\n            OneHotEncoder(handle_unknown=\"ignore\"),\n        ), CATEGORICAL),\n    ])),\n    (\"clf\", HistGradientBoostingClassifier(random_state=42)),\n])\npipe.fit(X_train, y_train)\n\nproba = pipe.predict_proba(X_test)[:, 1]\nprint(\"grouped AUC:\", round(roc_auc_score(y_test, proba), 3))\n\n# A probability is not a decision. A missed readmission costs a readmission;\n# a false alarm costs one 10-minute phone call. So take the highest threshold\n# that still catches 60 percent of true readmissions.\nprecision, recall, thresholds = precision_recall_curve(y_test, proba)\ni = int(np.where(recall[:-1] >= 0.60)[0].max())\nthreshold = float(thresholds[i])\nprint(f\"threshold={threshold:.3f} \"\n      f\"precision={precision[i]:.3f} recall={recall[i]:.3f}\")\n\n# Ship the fitted pipeline, the threshold and the split together. One artifact.\njoblib.dump(\n    {\n        \"pipeline\": pipe,\n        \"threshold\": threshold,\n        \"columns\": COLUMNS,\n        \"train_patients\": sorted(groups.iloc[train_idx].unique().tolist()),\n        \"test_patients\": sorted(groups.iloc[test_idx].unique().tolist()),\n    },\n    \"model.joblib\",\n)"
      },
      {
        "type": "p",
        "text": "Three things just happened. Your reported score is now honest. You stopped shipping a probability and started shipping a decision, with the threshold derived from which mistake hurts more. And the feature list is now a real, named, frozen thing — eight columns, not whatever get_dummies happened to produce — which means the API you deploy in a moment can actually be built against it."
      },
      {
        "type": "p",
        "text": "One more move, and it is the one people skip. Do not put the no-leakage assertion next to the splitter, where it checks a property GroupShuffleSplit already guarantees and can never fail. Put it in the eval script, where it reads the split back out of the saved artifact. There it can fail, because a future refactor of train.py can quietly reintroduce the leak, and this is the thing that catches it."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "# eval.py -- scores the artifact that ships, not the notebook that made it.\nimport joblib\nimport pandas as pd\nfrom sklearn.metrics import roc_auc_score\n\nbundle = joblib.load(\"model.joblib\")\ntrain_patients = set(bundle[\"train_patients\"])\ntest_patients = set(bundle[\"test_patients\"])\n\n# This assertion can actually fail. It checks the persisted split, so a change\n# to train.py that reintroduces the leak fails here, in CI, not in the viva.\nleaked = train_patients & test_patients\nassert not leaked, f\"leak: {len(leaked)} patients in both splits\"\n\ndf = pd.read_csv(\"diabetic_data.csv\", na_values=\"?\")\ntest = df[df[\"patient_nbr\"].isin(test_patients)]\ny_test = (test[\"readmitted\"] == \"<30\").astype(int)\nproba = bundle[\"pipeline\"].predict_proba(test[bundle[\"columns\"]])[:, 1]\n\nprint(\"held-out patients:\", len(test_patients))\nprint(\"grouped AUC:\", round(roc_auc_score(y_test, proba), 3))"
      },
      {
        "type": "quote",
        "text": "An examiner cannot break a project that has already told them where it breaks."
      },
      {
        "type": "p",
        "text": "The final scoped statement now fits in one sentence: \"A readmission-risk service for diabetic inpatients, evaluated with a patient-grouped split so that no patient appears in both train and test, with a decision threshold tuned to a 60 percent recall target, served from a deployed API whose request schema is the model's feature schema.\" That is a defensible major project. \"AI for healthcare\" was not."
      },
      {
        "type": "h2",
        "text": "The one hard thing rule"
      },
      {
        "type": "p",
        "text": "Every good project has exactly one part that could genuinely fail — where you do not know the answer on day one and have to go find out. Everything else exists to hold that part up."
      },
      {
        "type": "ul",
        "items": [
          "ML: honest evaluation under leakage, class imbalance, or distribution shift. Rarely the model itself.",
          "Systems: making something correct under concurrency, or fast when it has no right to be.",
          "Embedded: doing real work inside a power, memory, or latency budget you cannot exceed.",
          "Web and product: a genuinely hard piece of state — offline sync, conflict resolution, real-time collaboration.",
          "Security: a threat model you can articulate, and a mitigation you can demonstrate breaking and then holding."
        ]
      },
      {
        "type": "p",
        "text": "Everything around the one hard thing should be boring on purpose. Postgres. A single server. Server-rendered pages. A managed host. Boring infrastructure is not a lack of ambition; it is what buys you the weeks you need for the part that is actually hard. Two hard things in a 12-week project usually means you do neither of them well, and the seam between them is exactly where the viva goes."
      },
      {
        "type": "h2",
        "text": "A week-by-week skeleton for a 12-week capstone"
      },
      {
        "type": "p",
        "text": "The ordering matters more than the content. Note where deployment sits — week three, not week eleven."
      },
      {
        "type": "ol",
        "items": [
          "Week 1: Write scope.yml. Get the data or the API keys in hand. If the data does not exist, the project does not exist — find that out now, not in week seven.",
          "Week 2: Build the ugliest end-to-end path. Input goes in one end, a garbage answer comes out the other. Hardcode everything. It must run.",
          "Week 3: Deploy that garbage version to a real URL. Yes, now. This is the cheapest week you will ever have to fight config, secrets, ports, and build tooling.",
          "Week 4: Set up the evaluation or the test harness — the thing that tells you whether you are getting better. Before you try to get better.",
          "Weeks 5-7: The one hard thing. This is the project. Protect these three weeks like rent.",
          "Week 8: Freeze the core. No new capability after this point. Write down the honest numbers, including the disappointing ones.",
          "Week 9: The system around it — persistence, auth if you truly need it, error handling, the interface a human touches.",
          "Week 10: Break it on purpose. Empty input, huge input, malformed input, the network dying mid-request. Fix what you can, document what you cannot.",
          "Week 11: The report and the README. Diagrams of the real architecture, not the one you imagined in week one.",
          "Week 12: Rehearse the defense out loud, in front of someone who will interrupt you. Leave buffer for the thing that will go wrong."
        ]
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "Leaving deployment to the final week is a reliable way to end a capstone with a laptop demo and an apology. Deployment failures are rarely small: environment, dependency, secret, and build failures tend to arrive at once, in the week you have the least slack. Do it in week three, when it costs you two days and teaches you what your project actually needs."
      },
      {
        "type": "h2",
        "text": "What do I cut when I am behind?"
      },
      {
        "type": "p",
        "text": "You will probably be behind by week eight. That is normal and survivable, as long as you cut in the right order. Cut from the top of this list first:"
      },
      {
        "type": "ol",
        "items": [
          "Breadth of data. One disease, one crop, one city, one language. Not five.",
          "Feature count. The three features nobody asked for, including the admin panel.",
          "UI polish. A plain, fast, working interface is far easier to defend than a beautiful broken one.",
          "Extra models and extra comparisons. Two baselines you understand beat six you cannot explain.",
          "Real-time anything. Batch is fine. Say it is batch and say why."
        ]
      },
      {
        "type": "p",
        "text": "Never cut these three: the evaluation, the deployment, and the honest write-up of what does not work. And when you cut, cut loudly — put it in the report as a named limitation with a reason. \"We did not audit fairness across demographic subgroups: splitting the held-out set by subgroup left too few positive readmissions in several groups to report a rate we could stand behind, so we report none and name it here.\" A limitation you declared reads very differently from one that gets discovered."
      },
      {
        "type": "h2",
        "text": "Why \"deployed to a real URL\" changes how the project is read"
      },
      {
        "type": "p",
        "text": "A local demo asks the viewer to trust you. A URL does not ask for anything; it either loads or it does not. But the real value is not the impression. Deployment forces you to confront what a laptop demo lets you avoid: config that is not hardcoded, secrets that are not in the repo, a model small enough to load, latency you can measure, cold starts, CORS — and above all the feature contract, because the moment a request arrives as JSON you have to say exactly which columns your model expects and in what form. That is precisely why the fitted pipeline gets persisted and reused rather than rebuilt at inference."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "# tests/test_smoke.py  ->  APP_URL=https://your-app.example.com pytest tests/\nimport os\n\nimport httpx\n\nBASE = os.environ[\"APP_URL\"].rstrip(\"/\")\n\n# The same eight fields the model was trained on. The request model in the API\n# declares age as a Literal of the ten dataset buckets, insulin as a Literal of\n# its four values, and time_in_hospital as an int with ge=1, le=14.\nVALID = {\n    \"age\": \"[70-80)\",\n    \"insulin\": \"Steady\",\n    \"diabetesMed\": \"Yes\",\n    \"time_in_hospital\": 5,\n    \"num_medications\": 18,\n    \"number_inpatient\": 2,\n    \"number_emergency\": 0,\n    \"number_diagnoses\": 9,\n}\n\n\ndef test_health():\n    r = httpx.get(f\"{BASE}/health\", timeout=10)\n    assert r.status_code == 200\n    assert r.json()[\"status\"] == \"ok\"\n\n\ndef test_predict_returns_a_probability_and_a_decision():\n    r = httpx.post(f\"{BASE}/predict\", json=VALID, timeout=10)\n    assert r.status_code == 200\n    body = r.json()\n    assert 0.0 <= body[\"readmission_probability\"] <= 1.0\n    assert body[\"decision\"] in {\"schedule_call\", \"no_call\"}\n\n\ndef test_rejects_an_age_outside_the_dataset_vocabulary():\n    # A full, otherwise-valid payload with exactly ONE bad field, so the 422 is\n    # about the value and not about a key we forgot to send.\n    r = httpx.post(f\"{BASE}/predict\", json=VALID | {\"age\": \"banana\"}, timeout=10)\n    assert r.status_code == 422  # FastAPI validation, not a 500\n\n\ndef test_rejects_an_impossible_length_of_stay():\n    r = httpx.post(f\"{BASE}/predict\", json=VALID | {\"time_in_hospital\": -3}, timeout=10)\n    assert r.status_code == 422"
      },
      {
        "type": "p",
        "text": "Those last two tests are what separate a project from an exercise, and note carefully what makes them work. They send a complete, valid payload and corrupt exactly one field. That only returns 422 because the request model constrains the value — age is a Literal of the dataset's ten bucket strings, not a free string. If you type age as a plain str, then \"banana\" is a perfectly good string, your service accepts it, the one-hot encoder shrugs at an unknown category, and you cheerfully score a patient who does not exist. Returning a clean 422 instead of a stack trace, or worse a confident number, is the difference between something that was built and something that was submitted."
      },
      {
        "type": "h2",
        "text": "The questions you will actually be asked"
      },
      {
        "type": "p",
        "text": "Scope your project so that you can answer all of these in one breath:"
      },
      {
        "type": "ul",
        "items": [
          "What is the input, and what is the output? Say it in one sentence.",
          "How did you split the data, and why that way?",
          "What is your baseline, and by how much do you beat it?",
          "Show me where it fails. What input breaks it?",
          "Why this technology and not the simpler one?",
          "What did you cut, and why?",
          "What would you do with four more weeks?"
        ]
      },
      {
        "type": "p",
        "text": "None of them are about how ambitious your idea was. Every one of them is about whether you understand the thing you made. A tightly scoped project can answer all seven. A sprawling one struggles with every single one, which is exactly why it is so uncomfortable to stand next to."
      },
      {
        "type": "p",
        "text": "This is how we scope work at Tenzok: one hard thing, boring infrastructure around it, deployed early, and an honest number rather than an impressive one. It is not a trick. It is what shipping software looks like when somebody has to maintain it afterwards."
      },
      {
        "type": "p",
        "text": "So pick the smallest problem you would still be proud to defend, and then defend it properly. That is worth more than an ambitious project you have to apologise for."
      }
    ],
    "faq": [
      {
        "q": "What is the real difference between a mini project and a major project?",
        "a": "A mini project is 3 to 4 weeks and does one hard thing properly — it needs a correct implementation and a clear explanation, not architecture. A major project is 10 to 12 weeks and is a system: multiple components with contracts between them, persistent state, real data, and something deployed. The mini project asks \"does it work and do you know why\". The major project also asks \"why is it built this way\"."
      },
      {
        "q": "How do I choose a final year project if my department only gives a vague topic?",
        "a": "Convert the topic into a problem before you write any code. A problem has a specific user, a decision that user makes differently because of your system, a cost of being wrong (false positives and false negatives usually cost different amounts), and a way to check that it worked on unseen data. If you cannot fill in all four, you still have a topic, and a topic has no finish line."
      },
      {
        "q": "Is it okay to use a public dataset for a final year project?",
        "a": "Yes, and it is usually the right call — collecting data can eat half your timeline. What matters is handling the dataset honestly. Many public datasets contain a trap, such as the same subject appearing across many rows, or missing values encoded as a literal \"?\" string that silently becomes a feature category. Finding and fixing that trap is often a stronger contribution than the model itself. My own view: a leakage-free evaluation on a well-known dataset is worth more than a novel dataset with a broken split."
      },
      {
        "q": "What is data leakage in a final year ML project, and how do I avoid it?",
        "a": "The common form is group leakage: your dataset has repeated subjects (the same patient, user, or device across many rows), and a random row-level split puts the same subject in both train and test. The model can then memorise the subject instead of learning the pattern, and your score is usually optimistic as a result. Split on the group id with GroupShuffleSplit or GroupKFold, then assert in your eval script — reading the split back from the saved model artifact — that no group id appears on both sides, so a later refactor cannot quietly reintroduce the leak."
      },
      {
        "q": "Should I deploy my final year project, and when?",
        "a": "Deploy in week three, not week eleven. Deploy the ugliest working version before you build anything real. Deployment failures tend to arrive all at once — environment, dependencies, secrets, build config — and you want to hit them while you still have nine weeks of slack. Deployment also forces you to define your feature contract: once a request arrives as JSON you must state exactly which fields the model expects, which is a question a laptop demo lets you dodge."
      },
      {
        "q": "What should I cut first if my capstone is running behind?",
        "a": "Cut in this order: breadth of data (one disease, one language, one city), extra features and admin panels, UI polish, extra model comparisons, and real-time behaviour (batch is fine). Never cut the evaluation, the deployment, or the honest write-up of what does not work. When you cut, name the cut in your report as an explicit limitation with a reason — a limitation you declared reads very differently from one that gets discovered."
      }
    ]
  },
  {
    "slug": "rag-chatbot-that-actually-retrieves",
    "title": "How to Build a RAG Chatbot That Actually Retrieves",
    "excerpt": "Most RAG chatbot projects fail at retrieval, not generation — here is how to chunk on structure, store in pgvector, measure recall@k, and build a refusal path that actually fires.",
    "description": "A RAG chatbot is a retrieval project, not an LLM project: structure-aware chunking, pgvector, a recall@k eval set, citations, and a refusal path.",
    "keywords": [
      "RAG chatbot project",
      "how to build RAG",
      "pgvector RAG",
      "chatbot final year project",
      "RAG evaluation recall@k",
      "RAG chunking strategy",
      "document chatbot with citations",
      "stop RAG hallucination"
    ],
    "publishedAt": "2026-06-23",
    "readingMinutes": 12,
    "tags": [
      "RAG",
      "Python",
      "pgvector",
      "LLM"
    ],
    "body": [
      {
        "type": "p",
        "text": "Almost every RAG chatbot project fails in the same place, and it is not the place students expect. The model call is four lines of code. The prompt is a paragraph. What actually decides whether your document chatbot answers correctly is whether the right passage was in the context window at all — and for most projects, it wasn't. The model then did what models do: it wrote a fluent, confident, wrong answer from whatever it was handed."
      },
      {
        "type": "p",
        "text": "So if you are building a RAG chatbot as a mini project or a final-year capstone, understand the shape of the work before you start: the retrieval is the project. The LLM call is the easy part. This post walks through the parts that actually take engineering — structure-aware chunking, embedding and querying with pgvector, an evaluation set you build by hand, a citation contract, and a refusal path for when retrieval comes up empty."
      },
      {
        "type": "p",
        "text": "The Python below is real. The chunker and the scoring functions are tested and their behaviour is described accurately. The database and API code is real code, but you will need to wire up your own DSN, schema, and API key before it runs — I am not going to pretend a blog post is a working repository. The embedding model runs locally and costs nothing, so you can build the whole retrieval half before you spend a rupee on API calls. That ordering is deliberate."
      },
      {
        "type": "h2",
        "text": "Why does my RAG chatbot answer confidently and wrongly?"
      },
      {
        "type": "p",
        "text": "Because a language model given irrelevant context does not say \"this context is irrelevant.\" It pattern-matches. Hand it five chunks about leave policy when the question was about gratuity eligibility, and it will assemble something gratuity-shaped out of leave-policy vocabulary. The failure is silent, and it looks exactly like a correct answer."
      },
      {
        "type": "p",
        "text": "That means the interesting question in your project is never \"which model did you use.\" It is: for a question whose answer exists in your corpus, how often is the passage containing that answer actually in the top k results? That number has a name — recall@k — and if you cannot state yours, you do not know whether your system works."
      },
      {
        "type": "quote",
        "text": "An LLM cannot fix a retrieval failure. It can only make one harder to see."
      },
      {
        "type": "h2",
        "text": "What is wrong with fixed-size chunking?"
      },
      {
        "type": "p",
        "text": "Here is the chunker almost every tutorial starts with, and it is the single biggest destroyer of retrieval quality in student RAG projects:"
      },
      {
        "type": "code",
        "lang": "python",
        "code": "# The wrong way. Do not ship this.\ndef chunk(text, size=1000, overlap=200):\n    out = []\n    for i in range(0, len(text), size - overlap):\n        out.append(text[i:i + size])\n    return out"
      },
      {
        "type": "p",
        "text": "It slices on character count, which has nothing to do with meaning. A definition gets severed from the term it defines. A table header lands in one chunk and its rows in the next. A clause that begins \"This shall not apply where...\" ends up in a different chunk from the rule it negates — so retrieval returns the rule, the model reads the rule, and the model tells the user the opposite of the truth. The overlap parameter does not save you; it just means you now have two chunks that are each half-wrong."
      },
      {
        "type": "p",
        "text": "Chunk on structure instead. Documents already carry it: headings, paragraphs, list items, fenced code, table boundaries. Split on those, pack the pieces up to a token budget, and carry the heading into the chunk so the embedding knows what the text is about. Three details in the code below are load-bearing, and every one of them is a bug I have watched a structure-aware chunker ship with. It flushes the chunk whenever the heading changes, so a chunk is never labelled with a heading that only applies to its first block. It tracks fenced-code state, so the comments inside a Python listing are not mistaken for Markdown headings. And it requires whitespace after the hashes, so a table row beginning with a hash is not a section break."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import re\nfrom dataclasses import dataclass\nfrom sentence_transformers import SentenceTransformer\n\n# 384 dimensions, 512-token input limit. Runs on a laptop CPU. Free.\nmodel = SentenceTransformer(\"BAAI/bge-small-en-v1.5\")\ntok = model.tokenizer\n\ndef n_tokens(text: str) -> int:\n    return len(tok.encode(text, add_special_tokens=False))\n\n@dataclass\nclass Chunk:\n    doc_id: str\n    ordinal: int\n    heading: str\n    text: str\n\nHEADING_RE = re.compile(r\"#{1,6}\\s\")     # a hash with no space is not a heading\nFENCE_RE   = re.compile(r\"^\\s*(```|~~~)\")\n\ndef split_blocks(markdown: str):\n    \"\"\"Yield (heading, block) pairs. A fenced code block is one block.\"\"\"\n    heading, buf, fence = \"\", [], None\n\n    def flush():\n        nonlocal buf\n        block = \"\\n\".join(buf).strip()\n        buf = []\n        return block or None\n\n    for line in markdown.splitlines():\n        m = FENCE_RE.match(line)\n        if fence is not None:                 # inside a code fence: never parse headings\n            buf.append(line)\n            if m and m.group(1) == fence:\n                fence = None\n                if (b := flush()):\n                    yield heading, b\n            continue\n        if m:                                 # opening a fence\n            if (b := flush()):\n                yield heading, b\n            fence = m.group(1)\n            buf.append(line)\n        elif HEADING_RE.match(line):\n            if (b := flush()):\n                yield heading, b\n            heading = line.lstrip(\"#\").strip()\n        elif not line.strip():\n            if (b := flush()):\n                yield heading, b\n        else:\n            buf.append(line)\n    if (b := flush()):\n        yield heading, b\n\ndef chunk_document(doc_id: str, markdown: str, max_tokens: int = 350,\n                   overlap_blocks: int = 1) -> list[Chunk]:\n    chunks, cur, cur_tokens, ordinal = [], [], 0, 0\n\n    def flush():\n        nonlocal cur, cur_tokens, ordinal\n        if not cur:\n            return\n        chunks.append(Chunk(doc_id, ordinal, cur[0][0],\n                            \"\\n\\n\".join(b for _, b in cur)))\n        ordinal += 1\n        # carry overlap only when it will not make the next chunk a superset of this one\n        cur = cur[-overlap_blocks:] if overlap_blocks and len(cur) > overlap_blocks else []\n        cur_tokens = sum(n_tokens(b) for _, b in cur)\n\n    for heading, block in split_blocks(markdown):\n        if cur and heading != cur[-1][0]:     # heading changed: close the chunk\n            flush()\n            cur, cur_tokens = [], 0           # and never carry overlap across a heading\n        if cur and cur_tokens + n_tokens(block) > max_tokens:\n            flush()\n        cur.append((heading, block))\n        cur_tokens += n_tokens(block)\n    flush()\n    return chunks"
      },
      {
        "type": "p",
        "text": "The overlap is now a whole block, not 200 arbitrary characters, so the boundary between two chunks always falls where the document itself had a boundary. Without the heading-change flush, a chunk containing the tail of \"Casual Leave\" and the start of \"Gratuity\" gets stored under the heading \"Casual Leave\" and embedded as if it were about leave — which is precisely the definition-severed-from-its-term failure the structure-aware chunker exists to prevent."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "bge-small-en-v1.5 has a hard 512-token input limit. Anything longer is silently truncated by the encoder — no error, no warning, just an embedding computed from the first half of your text. The chunker above budgets 350 tokens, but a single oversized block — a long code listing, a wide table — can still blow past the limit on its own. Assert on it, or hard-split it. This bug is invisible until you measure recall."
      },
      {
        "type": "h2",
        "text": "Embedding and storing with pgvector"
      },
      {
        "type": "p",
        "text": "You do not need a dedicated vector database for a project of this size. Postgres with the pgvector extension gives you vector search, keyword search, and your application tables in one place, with one backup story and one connection pool. Start here; graduate later if you ever actually need to."
      },
      {
        "type": "code",
        "lang": "sql",
        "code": "CREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE chunks (\n    id           bigserial PRIMARY KEY,\n    doc_id       text        NOT NULL,\n    ordinal      int         NOT NULL,\n    heading      text        NOT NULL DEFAULT '',\n    content      text        NOT NULL,\n    content_hash text        NOT NULL,      -- sha256(doc_id || ordinal || content)\n    embedding    vector(384) NOT NULL,\n    tsv          tsvector GENERATED ALWAYS AS (\n                     to_tsvector('english', heading || ' ' || content)\n                 ) STORED,\n    UNIQUE (doc_id, ordinal)                -- makes re-ingest idempotent\n);\n\n-- Approximate nearest neighbour index for cosine distance.\nCREATE INDEX chunks_embedding_hnsw ON chunks\n    USING hnsw (embedding vector_cosine_ops);\n\n-- Keyword index. You will need it; see below.\nCREATE INDEX chunks_tsv ON chunks USING gin (tsv);"
      },
      {
        "type": "p",
        "text": "Now embed and insert. Three details matter. Normalize the vectors, so cosine distance behaves. BGE models are trained asymmetrically — passages are embedded as-is, but queries get a specific instruction prefix, and skipping it quietly costs you retrieval quality for no reason. And make re-ingest idempotent: the UNIQUE constraint plus ON CONFLICT DO UPDATE means running the ingest twice on the same document updates rows in place instead of inserting a second copy under fresh ids. Be clear-eyed about what that does and does not buy you, though. Chunk ids are a bigserial surrogate key. They are stable across a re-ingest of the same chunking, and they are meaningless across a different one — change the chunk size and every boundary moves, so the rows are genuinely different rows. That is why the eval set in the next section is labelled against text, not against ids."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import hashlib\nimport psycopg\nfrom pgvector.psycopg import register_vector\n\nQUERY_PREFIX = \"Represent this sentence for searching relevant passages: \"\n\ndef embed_passages(texts: list[str]):\n    return model.encode(texts, batch_size=32, normalize_embeddings=True)\n\ndef embed_query(question: str):\n    return model.encode(QUERY_PREFIX + question, normalize_embeddings=True)\n\ndef content_hash(c: Chunk) -> str:\n    payload = f\"{c.doc_id}\\x00{c.ordinal}\\x00{c.text}\".encode(\"utf-8\")\n    return hashlib.sha256(payload).hexdigest()\n\ndef ingest(conn, doc_id: str, chunks: list[Chunk]) -> None:\n    payload = [f\"{c.heading}\\n\\n{c.text}\".strip() for c in chunks]\n    vecs = embed_passages(payload)\n    with conn.cursor() as cur:\n        for c, v in zip(chunks, vecs):\n            cur.execute(\n                \"\"\"INSERT INTO chunks\n                       (doc_id, ordinal, heading, content, content_hash, embedding)\n                   VALUES (%s, %s, %s, %s, %s, %s)\n                   ON CONFLICT (doc_id, ordinal) DO UPDATE SET\n                       heading      = EXCLUDED.heading,\n                       content      = EXCLUDED.content,\n                       content_hash = EXCLUDED.content_hash,\n                       embedding    = EXCLUDED.embedding\"\"\",\n                (c.doc_id, c.ordinal, c.heading, c.text, content_hash(c), v),\n            )\n        # a re-chunk can produce fewer chunks than last time; drop the stale tail\n        cur.execute(\"DELETE FROM chunks WHERE doc_id = %s AND ordinal >= %s\",\n                    (doc_id, len(chunks)))\n    conn.commit()"
      },
      {
        "type": "h3",
        "text": "Vector search alone will embarrass you"
      },
      {
        "type": "p",
        "text": "Embeddings are good at meaning and bad at literal tokens. Ask for \"section 12(b)\" or a part number, and the nearest-neighbour search returns passages that are semantically about the same topic while missing the one that literally contains the string. Postgres full-text search is good at exactly the thing embeddings are weak at, and you already created the index. Be precise about what it is, though: to_tsvector('english', ...) does lexeme matching, not exact-string matching. It stems and splits, so \"section 12(b)\" becomes the lexemes section, 12 and b — which is enough to find the right clause. It is not enough for an identifier like ERR_4021-B, which gets fragmented on the punctuation. For identifiers, add a second index using the simple config, or a GIN trigram index via pg_trgm for real substring matching. Then fuse the two ranked lists with Reciprocal Rank Fusion — no score calibration, no tuning, just ranks."
      },
      {
        "type": "code",
        "lang": "sql",
        "code": "-- hybrid.sql\nWITH vec AS (\n    SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> %(q)s) AS rank\n    FROM chunks\n    ORDER BY embedding <=> %(q)s\n    LIMIT 50\n),\nkw AS (\n    SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(tsv, query) DESC) AS rank\n    FROM chunks, websearch_to_tsquery('english', %(text)s) query\n    WHERE tsv @@ query\n    ORDER BY ts_rank_cd(tsv, query) DESC\n    LIMIT 50\n)\nSELECT c.id, c.doc_id, c.heading, c.content,\n       kw.rank AS kw_rank,\n       COALESCE(1.0 / (60 + vec.rank), 0)\n     + COALESCE(1.0 / (60 + kw.rank),  0) AS score,\n       1 - (c.embedding <=> %(q)s)         AS cosine_similarity\nFROM vec\nFULL OUTER JOIN kw USING (id)\nJOIN chunks c ON c.id = COALESCE(vec.id, kw.id)\nORDER BY score DESC\nLIMIT %(k)s;"
      },
      {
        "type": "p",
        "text": "The 60 in the denominator is the standard RRF constant. Do not agonise over it. Do, however, notice the LIMIT 50 in the vec CTE, because there is a trap right there: pgvector's hnsw.ef_search defaults to 40, and asking an HNSW index for more rows than its candidate list size quietly degrades recall. The query above asks for 50. So ef_search is a precondition of this query, not a remedy you reach for later — set it before you run it. Joining from the two CTEs rather than scanning chunks and filtering matters too: the outer query then touches about a hundred candidate rows instead of the whole table."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import os\nfrom pathlib import Path\nfrom psycopg.rows import dict_row\n\nDSN = os.environ[\"DATABASE_URL\"]\nHYBRID_SQL = Path(\"hybrid.sql\").read_text(encoding=\"utf-8\")\n\ndef retrieve(conn, question: str, k: int = 6) -> list[dict]:\n    qv = embed_query(question)\n    with conn.cursor(row_factory=dict_row) as cur:\n        # Must be >= the LIMIT in the vec CTE, or HNSW silently loses recall.\n        # SET LOCAL scopes it to the current transaction (psycopg opens one for you).\n        cur.execute(\"SET LOCAL hnsw.ef_search = 100\")\n        cur.execute(HYBRID_SQL, {\"q\": qv, \"text\": question, \"k\": k})\n        return cur.fetchall()"
      },
      {
        "type": "h2",
        "text": "Build the eval set before you touch the prompt"
      },
      {
        "type": "p",
        "text": "This is the step that separates a project that works from a project that demos. Open your corpus. Write 20 to 30 questions a real user would ask. For each one, copy out the exact span of text that answers it. That is your eval set. It takes an afternoon and it is the most valuable artifact in the repository — more valuable than the code, because the code is replaceable and the labels are not."
      },
      {
        "type": "p",
        "text": "Label against the text, not against chunk ids. This is the part people get wrong, and it is worth being explicit about why. The moment you change the chunk size — the very first experiment this post tells you to run — every chunk boundary moves and every id is meaningless. If your labels point at chunk 412, they now point at a chunk that no longer contains what you meant. You would silently invalidate the entire eval set with the first thing you tried, and the numbers would still come out looking plausible. A gold answer span survives re-chunking because it is a property of the document, not of your chunking strategy. So a retrieval counts as a hit when the retrieved chunk's content contains the gold span."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import json, re, statistics\n\n# evalset.jsonl — one object per line, written by hand:\n# {\"question\": \"How many days of casual leave am I entitled to?\",\n#  \"gold_texts\": [\"twelve days of casual leave\"]}\n\ndef normalize(s: str) -> str:\n    return re.sub(r\"\\s+\", \" \", s).strip().lower()\n\ndef is_hit(content: str, gold_texts: list[str]) -> bool:\n    hay = normalize(content)\n    return any(normalize(g) in hay for g in gold_texts)\n\ndef load_evalset(path: str) -> list[dict]:\n    with open(path, encoding=\"utf-8\") as f:\n        return [json.loads(line) for line in f if line.strip()]\n\ndef evaluate(conn, evalset: list[dict], ks=(1, 3, 5, 10)) -> dict:\n    kmax = max(ks)\n    hits = {k: 0 for k in ks}\n    reciprocal_ranks = []\n\n    for row in evalset:\n        retrieved = retrieve(conn, row[\"question\"], k=kmax)\n        flags = [is_hit(r[\"content\"], row[\"gold_texts\"]) for r in retrieved]\n\n        for k in ks:\n            if any(flags[:k]):\n                hits[k] += 1\n\n        rank = next((i + 1 for i, f in enumerate(flags) if f), None)\n        reciprocal_ranks.append(1.0 / rank if rank else 0.0)\n\n    n = len(evalset)\n    return {**{f\"recall@{k}\": hits[k] / n for k in ks},\n            \"mrr\": statistics.fmean(reciprocal_ranks)}\n\nif __name__ == \"__main__\":\n    with psycopg.connect(DSN) as conn:\n        register_vector(conn)\n        print(evaluate(conn, load_evalset(\"evalset.jsonl\")))"
      },
      {
        "type": "p",
        "text": "Now you have a number. Change the chunk size and run it again — and because the labels are text spans, the eval set still means what it meant before. Turn off the keyword arm and run it again. Drop the query prefix and run it again. Every one of those is a five-minute experiment with an honest answer at the end, and you will be surprised at least twice. Put the resulting table in your report — a chart of recall@5 across four chunking strategies is worth more to an examiner than another screenshot of a chat bubble."
      },
      {
        "type": "callout",
        "tone": "note",
        "text": "Run the eval with the HNSW index and without it. HNSW is an approximate index: it trades recall for speed, and the gap is a number you can measure rather than a thing you assume. If recall@5 is lower with the index, raise hnsw.ef_search until it comes back. You can only catch this if the measurement exists."
      },
      {
        "type": "p",
        "text": "And be honest with yourself about what counts as evidence. \"It works on my three test questions\" is not evidence — three questions you invented after building the system will happen to be the three the system handles. Twenty-five questions written from the documents, before you tuned anything, with a measured recall@5 and every single failure listed and explained: that is evidence. The failures are the most interesting part. Go read them."
      },
      {
        "type": "h2",
        "text": "Citations are not a feature, they are the contract"
      },
      {
        "type": "p",
        "text": "A grounded answer must be checkable. That means every claim carries the id of the chunk it came from, the UI renders that id as a link to the source passage, and — critically — you verify after generation that the cited ids are actually in the set you retrieved. A model that cites a chunk you never gave it has hallucinated the citation too, and you should reject the whole answer rather than show it."
      },
      {
        "type": "h2",
        "text": "The refusal path is the anti-hallucination guardrail"
      },
      {
        "type": "p",
        "text": "Your system needs a way to say \"I don't know.\" Two independent gates, because either one alone leaks. Gate one: if retrieval did not turn up anything that looks like a real match, do not call the model at all. Gate two: force the model into a structured response with an explicit sufficiency flag, and let it decline. Gate one has a subtlety that will bite you. The obvious implementation checks the similarity of the top result — but the top result is the top RRF-fused result, and it may have been surfaced entirely by the keyword arm. Someone asks for \"section 12(b)\", the keyword arm correctly ranks the exact-match clause first, its cosine similarity is mediocre because embeddings are bad at literal tokens, and your refusal gate throws away the exact case you added hybrid search to fix. So check the best similarity across all hits, and let a strong keyword hit override the floor."
      },
      {
        "type": "p",
        "text": "The threshold itself is the other trap, and it is why the code below refuses to ship with a default. BGE embeddings are strongly anisotropic: their similarities are compressed into the upper part of the range, so two completely unrelated short texts typically score somewhere around 0.6 to 0.75, not near zero. A floor of 0.45 would therefore never fire — you would believe you had two gates while shipping one, and you would also conclude your retrieval is excellent because everything scores 0.7. For bge-small the useful threshold usually lands somewhere around 0.7 to 0.8, and the only way to find yours is to measure it. Add 10 questions to your eval set whose answers are deliberately not in the corpus, and pick the threshold that refuses those without refusing the answerable ones. Your refusal rate becomes a measured number too."
      },
      {
        "type": "code",
        "lang": "python",
        "code": "import json\nimport anthropic\n\nclient = anthropic.Anthropic()   # reads ANTHROPIC_API_KEY\n\nANSWER_SCHEMA = {\n    \"type\": \"object\",\n    \"properties\": {\n        \"sufficient\": {\"type\": \"boolean\"},\n        \"answer\":     {\"type\": \"string\"},\n        \"citations\":  {\"type\": \"array\", \"items\": {\"type\": \"integer\"}},\n    },\n    \"required\": [\"sufficient\", \"answer\", \"citations\"],\n    \"additionalProperties\": False,\n}\n\nSYSTEM = (\n    \"Answer only from the numbered sources provided. Every factual sentence \"\n    \"must cite the id of the source it came from. If the sources do not \"\n    \"contain the answer, set sufficient to false, leave answer empty, and \"\n    \"cite nothing. Never use prior knowledge. Respond with the final answer only.\"\n)\n\nREFUSAL = {\"sufficient\": False, \"answer\": \"\", \"citations\": []}\n\nMIN_SIMILARITY = None   # You MUST calibrate this on unanswerable questions.\n\ndef answer(conn, question: str) -> dict:\n    if MIN_SIMILARITY is None:\n        raise RuntimeError(\"Calibrate MIN_SIMILARITY on your unanswerable set first.\")\n\n    hits = retrieve(conn, question, k=6)\n    if not hits:\n        return dict(REFUSAL)\n\n    # Gate 1: retrieval confidence. Cheapest refusal there is — no API call.\n    # Best similarity across ALL hits, not hits[0]: the top RRF result may have\n    # come from the keyword arm and carry a mediocre cosine score.\n    best_sim = max(h[\"cosine_similarity\"] for h in hits)\n    exact_match = any(h[\"kw_rank\"] is not None and h[\"kw_rank\"] <= 3 for h in hits)\n    if best_sim < MIN_SIMILARITY and not exact_match:\n        return dict(REFUSAL)\n\n    sources = \"\\n\\n\".join(f\"[{h['id']}] {h['heading']}\\n{h['content']}\" for h in hits)\n\n    msg = client.messages.create(\n        model=\"claude-opus-4-8\",\n        max_tokens=1024,\n        system=SYSTEM,\n        messages=[{\"role\": \"user\",\n                   \"content\": f\"Sources:\\n\\n{sources}\\n\\nQuestion: {question}\"}],\n        output_config={\"format\": {\"type\": \"json_schema\", \"schema\": ANSWER_SCHEMA}},\n    )\n\n    # The model has a refusal path of its own. Do not crash on it.\n    # stop_reason \"refusal\" can arrive with an empty content list (IndexError),\n    # and \"max_tokens\" with truncated JSON (JSONDecodeError). Both are refusals.\n    if msg.stop_reason in (\"refusal\", \"max_tokens\") or not msg.content:\n        return dict(REFUSAL)\n    try:\n        result = json.loads(msg.content[0].text)\n    except json.JSONDecodeError:\n        return dict(REFUSAL)\n\n    # Gate 2: citations must point at chunks we actually retrieved.\n    allowed = {h[\"id\"] for h in hits}\n    result[\"citations\"] = [c for c in result[\"citations\"] if c in allowed]\n    if result[\"sufficient\"] and not result[\"citations\"]:\n        return dict(REFUSAL)   # an answer with no surviving evidence is a refusal\n\n    return result"
      },
      {
        "type": "p",
        "text": "Note the last gate carefully: when the citation filter strips every id the model produced, the answer text is discarded along with them. Demoting the sufficiency flag but keeping the prose is a bug — a caller that renders result[\"answer\"] would happily display an answer whose evidence you just proved was invented. If you would rather not hand-roll the JSON parsing at all, the SDK's client.messages.parse() validates the response against the same schema for you; you still need the stop_reason check."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "On current Claude models the sampling parameters are gone — passing temperature, top_p, or top_k to claude-opus-4-8 returns a 400. If you are copying a RAG snippet from a 2024 blog post that sets temperature=0 \"for determinism,\" delete that line. Steer the model with the system prompt and the schema instead. Omitting the thinking parameter runs the model without extended thinking, which is what you want inside a latency budget."
      },
      {
        "type": "h2",
        "text": "The cost and latency budget"
      },
      {
        "type": "p",
        "text": "Do the arithmetic before you demo, because someone will ask. Six chunks at roughly 350 tokens is about 2,100 tokens of sources, plus the system prompt and the question — call it 2,400 input tokens. A grounded answer with citations is maybe 250 output tokens. At Claude Opus 4.8's list price of $5 per million input tokens and $25 per million output, that is roughly $0.018 per question, about 55 questions per dollar. The same call on Claude Haiku 4.5 ($1 and $5 per million) is roughly $0.004, about 270 questions per dollar. Those are the two numbers to put on the slide; which tradeoff you make is a product decision, not a technical one. And note where the money is not: retrieval costs you nothing in API spend, because the query embedding runs locally and the search is a database query. It is not free — the encoder burns CPU and the search burns I/O — but almost all of your money and almost all of your latency lives in the generation call. Optimising your vector index for speed before you have measured end-to-end p95 is premature by a wide margin."
      },
      {
        "type": "p",
        "text": "Prompt caching will not save you here either, and you should know why before you try it. Caching is a prefix match — it only pays off when a large chunk of the beginning of the prompt is byte-identical across requests. In a RAG loop the retrieved sources change with every question, so the only stable prefix is the system prompt, and on Opus 4.8 the minimum cacheable prefix is 4,096 tokens. The system prompt above is under a hundred. It would never cache, silently, with no error. The lever that actually reduces cost is retrieving fewer, better chunks — which brings you right back to recall@k."
      },
      {
        "type": "h2",
        "text": "What to actually build, in order"
      },
      {
        "type": "ol",
        "items": [
          "Ingest and chunk on structure. Assert that no chunk exceeds the encoder's token limit.",
          "Embed locally with a small open model. Store in pgvector with an HNSW index and a tsvector column.",
          "Hand-write 20 to 30 question/gold-span pairs. Measure recall@k and MRR. Write the number down.",
          "Iterate on retrieval only — chunk size, overlap, hybrid fusion, ef_search, query prefix — until recall@5 stops improving.",
          "Add 10 unanswerable questions and calibrate the similarity floor against them.",
          "Only now add the generation call, with a citation contract and both refusal gates."
        ]
      },
      {
        "type": "p",
        "text": "Notice that the model does not appear until step six. That ordering is the whole argument of this post, and it is the thing that will make your project defensible when someone asks the hard question — not \"does it work,\" but \"how do you know.\""
      },
      {
        "type": "p",
        "text": "This is how we work on final-year and mini projects at Tenzok: eval set first, retrieval measured, guardrails in the code rather than in the report. If you are building a RAG chatbot and your recall number does not exist yet, that is the place to start — with us or without us."
      }
    ],
    "faq": [
      {
        "q": "Is a RAG chatbot good enough for a final-year project?",
        "a": "Yes, but only if the retrieval half is real. A wrapper around an API call with fixed-size chunking is a weekend tutorial. A system with a hand-labelled evaluation set, a measured recall@k across several chunking strategies, hybrid vector plus keyword search, enforced citations, and a calibrated refusal path is a genuine engineering project — and it gives you something to defend in the viva beyond a screenshot of a chat window."
      },
      {
        "q": "How many question/answer pairs do I need in my RAG evaluation set?",
        "a": "Twenty to thirty is enough to be useful and small enough that you will actually write them. Add 10 more whose answers are deliberately absent from the corpus, so you can calibrate the refusal threshold too. Three test questions you thought up after building the system is not an evaluation set — it is confirmation bias with extra steps."
      },
      {
        "q": "Should I label my RAG eval set with chunk ids or with text?",
        "a": "With text. Label each question with the exact answer span from the document, and score a retrieval as a hit when the retrieved chunk contains that span. Chunk ids are a surrogate key that changes the moment you re-chunk — and re-chunking is the first experiment you will run. Labelling against ids means your first experiment silently invalidates your entire eval set while still producing plausible-looking numbers."
      },
      {
        "q": "What similarity threshold should I use to make a RAG chatbot refuse to answer?",
        "a": "There is no default you can copy, and copying a low one is worse than having no gate at all. BGE embeddings are anisotropic — two completely unrelated short texts typically score around 0.6 to 0.75 cosine similarity, not near zero. So a threshold like 0.45 never fires, and you ship one gate believing you have two. For bge-small the useful floor usually lands around 0.7 to 0.8, but you have to find yours by measuring against questions whose answers are not in the corpus."
      },
      {
        "q": "What chunk size should I use for RAG?",
        "a": "There is no universal answer, which is exactly why you build the eval set first. Start around 300 to 400 tokens with one block of overlap, split on document structure rather than character count, and then measure. Dense legal clauses want smaller chunks than narrative prose. Whatever you pick, make sure no chunk exceeds your embedding model's input limit, or it gets silently truncated."
      },
      {
        "q": "Do I need a dedicated vector database, or is pgvector enough?",
        "a": "pgvector is enough for essentially every student project and a great many production ones. It puts vector search, full-text keyword search, and your application tables in one database with one backup and one connection pool. A dedicated vector DB earns its complexity at scales you will not hit; adopt one when a measurement tells you to, not because a tutorial did."
      }
    ]
  },
  {
    "slug": "deploy-your-college-project-live-url",
    "title": "How to Deploy Your Final Year Project to a Real URL",
    "excerpt": "A localhost screenshot says \"I got it working once.\" A live URL says \"this runs without me.\" Here is the shortest honest path from your laptop to a real deployment: Docker, secrets, a health check, TLS, and CI/CD that ships on merge.",
    "description": "A practical guide to deploying your final year project: a real Dockerfile, GitHub Actions CI/CD, secrets, TLS, and the things that break first.",
    "keywords": [
      "how to deploy final year project",
      "deploy college project free",
      "ci cd for student project",
      "github actions deploy docker",
      "dockerfile for node project",
      "free hosting for student projects",
      "deploy project to live url"
    ],
    "publishedAt": "2026-07-01",
    "readingMinutes": 11,
    "tags": [
      "Deployment",
      "DevOps",
      "Final Year Project",
      "CI/CD"
    ],
    "body": [
      {
        "type": "p",
        "text": "If you want to know how to deploy your final year project, start by looking at your report. There is a good chance it contains a screenshot with localhost:3000 in the address bar. That one detail quietly tells the reader something you did not intend: this thing has only ever run on one laptop, in one terminal, with one person babysitting it."
      },
      {
        "type": "p",
        "text": "A live URL changes how the whole project is read. Not because a domain is impressive, but because getting to a URL forces you to answer questions localhost never asks. Where do the secrets live? What happens when the process dies? Did the migrations actually run? Can someone other than you start this? Those are the questions an examiner circles around without always having the vocabulary for them, and they are exactly the questions a production system answers."
      },
      {
        "type": "p",
        "text": "This is the shortest honest path from your machine to a real deployment: configuration out of the code, a container that builds the same way everywhere, a managed database, a health check that tells the truth, a reverse proxy that terminates TLS, and a pipeline that ships on merge. Real Dockerfile, real GitHub Actions YAML, and the specific things that will break the first time you try."
      },
      {
        "type": "h2",
        "text": "Why does a localhost screenshot read as unfinished?"
      },
      {
        "type": "p",
        "text": "Software that only runs on your laptop is not software yet. It is a set of instructions that happen to work because of things you did months ago and forgot: a Postgres you installed once, a .env that never left your home directory, a port that happened to be free, a node_modules you have not reinstalled since October. Deploying strips all of that away. The container starts from nothing, on a machine you have never touched, with only what you declared. Every implicit assumption becomes an explicit failure, which is the point. The deploy is not a formality at the end of the project. It is the first honest test the project has ever taken."
      },
      {
        "type": "h2",
        "text": "What actually counts as deployed?"
      },
      {
        "type": "ul",
        "items": [
          "A container image, versioned by commit SHA. One artefact, built once, shipped everywhere. With one caveat worth stating up front: an image built on an Apple Silicon laptop is linux/arm64 and will refuse to start on an amd64 server with exec format error. Build for the architecture the server actually runs.",
          "Configuration from the environment. No secret, no hostname, no API key in the repository. Ever.",
          "A managed database. Not a Postgres running inside your app container with data on a disk that vanishes on the next redeploy.",
          "A health check endpoint that fails when the app is genuinely broken, plus something that acts on it. Docker alone will only tell you; acting on it needs an orchestrator or a platform that polls the endpoint.",
          "A pipeline. Merge to main builds, tests, and deploys. If deploying is a manual ritual only you know, you have not deployed. You have performed."
        ]
      },
      {
        "type": "h2",
        "text": "Step 1: get the configuration out of the code"
      },
      {
        "type": "p",
        "text": "This is the change that unblocks everything else, and it is the one most projects skip. Here is the shape a project starts in when it has only ever run on one machine, and why it cannot be deployed as written."
      },
      {
        "type": "code",
        "lang": "ts",
        "code": "// src/server.ts — the version that cannot be deployed\nimport express from \"express\";\nimport cors from \"cors\";\nimport { Pool } from \"pg\";\n\nconst pool = new Pool({\n  connectionString: \"postgres://postgres:root@localhost:5432/mydb\",\n});\n\nconst app = express();\napp.use(cors({ origin: \"http://localhost:5173\" }));\n\napp.listen(3000, \"127.0.0.1\", () => console.log(\"http://localhost:3000\"));"
      },
      {
        "type": "p",
        "text": "Three fatal lines. The database URL is a hardcoded localhost that does not exist on the server. The CORS origin is your dev frontend, so the deployed frontend gets blocked. And listening on 127.0.0.1 inside a container means the process is reachable only from inside that container, so the platform's health check hits it, gets nothing, and marks your service dead. That last one is a miserable thing to debug, because the logs look fine."
      },
      {
        "type": "code",
        "lang": "ts",
        "code": "// src/server.ts — the version that deploys\nimport express from \"express\";\nimport cors from \"cors\";\nimport { Pool } from \"pg\";\n\nconst databaseUrl = process.env.DATABASE_URL;\nif (!databaseUrl) throw new Error(\"DATABASE_URL is not set\");\n\nconst origins = (process.env.CORS_ORIGINS ?? \"\")\n  .split(\",\")\n  .map((s) => s.trim())\n  .filter(Boolean);\nif (origins.length === 0) throw new Error(\"CORS_ORIGINS is not set\");\n\nconst pool = new Pool({\n  connectionString: databaseUrl,\n  // TLS on, and the server certificate is verified against Node's trusted roots.\n  ssl: process.env.PGSSL === \"require\" ? { rejectUnauthorized: true } : undefined,\n});\n\nconst app = express();\napp.use(express.json());\napp.use(cors({ origin: origins, credentials: true }));\n\nconst port = Number(process.env.PORT ?? 3000);\napp.listen(port, \"0.0.0.0\", () => console.log(`listening on :${port}`));"
      },
      {
        "type": "p",
        "text": "Two things there are deliberate. First, it throws at boot on a missing DATABASE_URL and on a missing CORS_ORIGINS. An empty origins array handed to cors() blocks every origin silently, and a container that starts happily and then refuses every request is far worse to debug than one that dies with a clear message. Fail fast, fail loudly, fail at boot, and apply that rule to every required variable, not only the ones you remember. Second, rejectUnauthorized is true. You will find plenty of snippets that set it to false; that keeps the encryption and throws away the identity check, which means anyone who can get in the middle of the connection can read it. Managed Postgres providers present publicly trusted certificates, so verification simply works. If yours uses a private CA, pass its certificate with the ca option. Do not switch verification off to make an error go away."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "If your frontend is Vite or Next.js, remember that VITE_ and NEXT_PUBLIC_ variables are baked in at build time, not read at runtime. Setting VITE_API_URL on the hosting dashboard after the build has already happened does nothing. It has to be present in the environment where the bundle is compiled, which usually means in your CI job."
      },
      {
        "type": "h2",
        "text": "Step 2: a Dockerfile you can actually trust"
      },
      {
        "type": "p",
        "text": "Multi-stage, non-root, production dependencies only, migrations included, health check baked in. This is a real Dockerfile for a TypeScript Express API that compiles to dist/ and uses node-pg-migrate for schema changes."
      },
      {
        "type": "code",
        "lang": "dockerfile",
        "code": "# syntax=docker/dockerfile:1\n\nFROM node:22-alpine AS build\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build            # tsc -> /app/dist\n\nFROM node:22-alpine AS deps\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci --omit=dev\n\nFROM node:22-alpine AS runtime\nENV NODE_ENV=production\nENV PORT=3000\nWORKDIR /app\nCOPY --from=deps  /app/node_modules ./node_modules\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/migrations ./migrations\nCOPY package.json ./\nUSER node\nEXPOSE 3000\nHEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \\\n  CMD wget -qO- \"http://127.0.0.1:${PORT}/healthz\" || exit 1\nCMD [\"node\", \"dist/server.js\"]"
      },
      {
        "type": "p",
        "text": "Every line there is load-bearing. The build stage needs TypeScript and every devDependency; the runtime image carries none of them. The separate deps stage installs production packages against the same lockfile, so what ships is exactly what you resolved. The migrations directory is copied into the runtime image on purpose, because the deploy runs migrations from this same image, which means the files have to be inside it and the migration tool has to sit in dependencies, not devDependencies, or npm ci --omit=dev will strip it out and the migrate command will die with cannot find module. Keep migration files as plain .js or .sql, not TypeScript, so the runtime image can execute them with no compiler present. USER node drops root; the official node images already create that user. wget ships inside Alpine's busybox, so the health check needs no extra package. Note also that the health check reads ${PORT} at runtime instead of hardcoding 3000, so if a platform hands you PORT=8080 the app and its own health check move together rather than the container declaring itself permanently unhealthy; EXPOSE is documentation only and does not need to follow. Finally, add a .dockerignore before your first build, or you will copy node_modules and .env straight into the image."
      },
      {
        "type": "code",
        "lang": "text",
        "code": "node_modules\ndist\n.git\n.env\n.env.*\n*.log\ncoverage"
      },
      {
        "type": "h2",
        "text": "Step 3: a health check that tells the truth"
      },
      {
        "type": "p",
        "text": "A health endpoint that returns 200 unconditionally is worse than none, because it teaches your platform to keep a broken app in rotation. Check the thing that actually breaks: the database connection. Returning the commit SHA alongside it is a small trick worth stealing. When you are standing in front of a projector and the demo behaves oddly, you can open /healthz and know in seconds whether the thing you are looking at is the code you think you deployed."
      },
      {
        "type": "code",
        "lang": "ts",
        "code": "app.get(\"/healthz\", async (_req, res) => {\n  try {\n    await pool.query(\"select 1\");\n    res.status(200).json({ status: \"ok\", sha: process.env.GIT_SHA ?? \"dev\" });\n  } catch (err) {\n    console.error(\"healthcheck failed\", err);\n    res.status(503).json({ status: \"degraded\" });\n  }\n});"
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "Be clear about what Docker does with this. HEALTHCHECK reports, it does not act: an unhealthy container keeps running, keeps its port bound, and keeps serving 503s. And --restart unless-stopped reacts to the process exiting, not to health status. Something else has to do the restarting: a PaaS that polls /healthz over HTTP and recycles the instance, an orchestrator (Compose with dependent restarts, Swarm, Kubernetes), or a small sidekick container such as autoheal. Until you add one of those, the endpoint is a truth-teller, not a repair mechanism."
      },
      {
        "type": "h2",
        "text": "Step 4: what has to exist on the server before the first deploy"
      },
      {
        "type": "ul",
        "items": [
          "Docker installed, and the deploy user added to the docker group (sudo usermod -aG docker deploy). Otherwise every command in the release script needs sudo and the SSH step fails on a permission error.",
          "The deploy user's public key in /home/deploy/.ssh/authorized_keys. Generate a key for this and nothing else. Your personal key does not belong in a CI secret.",
          "/srv/app/.env on the box, owned by deploy, chmod 600. It holds DATABASE_URL, CORS_ORIGINS, PGSSL and anything else the app needs. It never goes into git.",
          "/srv/app/release.sh, copied across by hand the first time and made executable with chmod +x.",
          "/srv/app/ghcr.token, chmod 600, containing a GitHub personal access token with read:packages and nothing else. GHCR packages are private by default, so without this the server's docker pull fails with denied. The alternative is to flip the package to public in its settings on GitHub, which is fine for an open-source project and wrong the moment the image contains anything you would not publish.",
          "A reverse proxy that terminates TLS. The container publishes to loopback only, so nothing reaches it from the internet until a proxy sits in front. Caddy is the least work, because it obtains and renews the certificate for you."
        ]
      },
      {
        "type": "code",
        "lang": "text",
        "code": "# /etc/caddy/Caddyfile\nyourdomain.com {\n  reverse_proxy 127.0.0.1:3000\n}"
      },
      {
        "type": "p",
        "text": "That is the entire proxy config. Point an A record at the server, open ports 80 and 443, reload Caddy, and https://yourdomain.com serves your container with a valid certificate. It is also why release.sh publishes with -p 127.0.0.1:3000:3000 rather than -p 3000:3000: binding to loopback means the only way in is through the proxy, so nobody can hit your app over plain HTTP on port 3000 and skip TLS entirely. Skip the proxy and that same loopback binding leaves you with a healthy container and a dead URL, which is the opposite of the thing this post promised you."
      },
      {
        "type": "h2",
        "text": "Step 5: the pipeline that ships on merge"
      },
      {
        "type": "p",
        "text": "This is a complete GitHub Actions workflow. It runs your tests against a real Postgres, builds the image for linux/amd64, pushes it to GitHub Container Registry tagged with the commit SHA, then deploys over SSH to any box running Docker. Put it in .github/workflows/deploy.yml."
      },
      {
        "type": "code",
        "lang": "yaml",
        "code": "name: ci-cd\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\nenv:\n  IMAGE: ghcr.io/${{ github.repository }}\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16-alpine\n        env:\n          POSTGRES_PASSWORD: postgres\n          POSTGRES_DB: app_test\n        ports: [\"5432:5432\"]\n        options: >-\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm run migrate\n        env:\n          DATABASE_URL: postgres://postgres:postgres@localhost:5432/app_test\n      - run: npm test\n        env:\n          DATABASE_URL: postgres://postgres:postgres@localhost:5432/app_test\n\n  build:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/setup-buildx-action@v3\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@v6\n        with:\n          context: .\n          push: true\n          platforms: linux/amd64   # match the server, not your laptop\n          tags: |\n            ${{ env.IMAGE }}:${{ github.sha }}\n            ${{ env.IMAGE }}:latest\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    environment: production\n    # two quick merges must not race: an older SHA landing last is a real bug\n    concurrency:\n      group: deploy-${{ github.ref }}\n      cancel-in-progress: false\n    steps:\n      - name: Deploy over SSH\n        env:\n          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}\n          KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}\n          HOST: ${{ secrets.DEPLOY_HOST }}\n          TAG: ${{ github.sha }}\n        run: |\n          mkdir -p ~/.ssh && chmod 700 ~/.ssh\n          printf '%s\\n' \"$SSH_KEY\" > ~/.ssh/id_ed25519\n          chmod 600 ~/.ssh/id_ed25519\n          printf '%s\\n' \"$KNOWN_HOSTS\" > ~/.ssh/known_hosts\n          ssh -i ~/.ssh/id_ed25519 deploy@\"$HOST\" \\\n            \"IMAGE=${{ env.IMAGE }}:$TAG /srv/app/release.sh\""
      },
      {
        "type": "p",
        "text": "Notice what the deploy step does not do: it does not run ssh-keyscan against the host on every deploy, which would mean trusting whatever key happens to answer, every single time. Run ssh-keyscan -H your.host once from your own machine, look at the output, and paste it into a DEPLOY_KNOWN_HOSTS secret. Now the pipeline refuses to talk to a server it has not been told about. On the server, release.sh does the part everyone forgets."
      },
      {
        "type": "code",
        "lang": "bash",
        "code": "#!/usr/bin/env bash\nset -euo pipefail\n: \"${IMAGE:?IMAGE is not set}\"\n\nGHCR_USER=your-github-username\n\n# GHCR packages are private by default: the server has to authenticate to pull.\ndocker login ghcr.io -u \"$GHCR_USER\" --password-stdin < /srv/app/ghcr.token\n\ndocker pull \"$IMAGE\"\n\n# Migrations run once, from this same image, before the new code serves traffic.\n# This only works because the runtime image contains ./migrations and the\n# migration tool is a production dependency.\ndocker run --rm --env-file /srv/app/.env \"$IMAGE\" npm run migrate\n\ndocker rm -f app 2>/dev/null || true\ndocker run -d --name app --restart unless-stopped \\\n  --env-file /srv/app/.env -e GIT_SHA=\"${IMAGE##*:}\" \\\n  -p 127.0.0.1:3000:3000 \"$IMAGE\"\n\necho \"$IMAGE\" >> /srv/app/deployed.log   # your rollback history"
      },
      {
        "type": "callout",
        "tone": "note",
        "text": "GHCR image names must be lowercase. If your GitHub username or repository name contains capital letters, ghcr.io/${{ github.repository }} fails with an obscure error. Hardcode the lowercase path instead. It is an easy detour to take on a first deploy, and an easy one to avoid."
      },
      {
        "type": "p",
        "text": "Three secrets go in Settings, then Secrets and variables, then Actions: DEPLOY_SSH_KEY (the deploy-only private key), DEPLOY_HOST, and DEPLOY_KNOWN_HOSTS. GITHUB_TOKEN is issued to the workflow automatically, and it is what lets the build job push to GHCR. The read-only token that lets the server pull lives on the server, not in the repository. Nothing sensitive is committed."
      },
      {
        "type": "h2",
        "text": "Where do you actually host it, for free or nearly free?"
      },
      {
        "type": "ul",
        "items": [
          "Platform-as-a-service free tiers. Genuinely free and git-push simple. The catch is cold starts, and the specifics are per-provider rather than universal: Render, for example, documents that its free web services spin down after a period of inactivity and take time to come back on the next request. Read your provider's current docs rather than trusting a number in a blog post, this one included, and hit the URL a few minutes before any demo.",
          "Managed Postgres (Neon, Supabase, and others). The free tiers are small but real. What you have to check is the idle policy, because it is written for hobby projects, not for a repo you leave alone between submission and viva. Both providers document how a free project behaves when it sits unused; go and read it, then open the app the day before the demo, not the hour before.",
          "A small VPS, roughly the price of a coffee per month. No cold starts, full control, and the SSH pipeline above works untouched. You are now responsible for the firewall, TLS, and updates, which is a legitimate thing to learn and a legitimate thing to write about in your report.",
          "Static frontend hosts (Vercel, Netlify, Cloudflare Pages). Free and excellent for a React or Next frontend. The API still has to live somewhere with a real backend runtime.",
          "The GitHub Student Developer Pack. Free credits from several cloud providers, available to students who pass GitHub's verification, which usually means a school email or proof of enrolment.",
          "What I would actually pick: frontend on a static host, API in a container on a small VPS, database on managed Postgres, TLS via Caddy. It is boring, it is cheap, and nothing in it will surprise you at 11pm the night before submission."
        ]
      },
      {
        "type": "h2",
        "text": "What breaks first, and roughly in what order"
      },
      {
        "type": "ol",
        "items": [
          "CORS. Your frontend is on one origin, your API on another, and now the browser cares. The error will say the response has no Access-Control-Allow-Origin header. That is not a frontend bug; it is your API refusing to consent. Set CORS_ORIGINS to your deployed frontend origin exactly, including https and no trailing slash. Do not reach for app.use(cors()) with no arguments to make the red text go away: that opens your API to every origin on the internet, and a reviewer who knows what they are looking at will notice.",
          "A hardcoded localhost that survived. There is always one more, and it is usually in the frontend. Grep the whole repo before you claim victory; the command below catches most of them.",
          "Migrations that never ran. The app deploys, the container is green, and every request 500s with relation \"users\" does not exist. Your schema lived in a local database the server has never seen. Migrations have to be files in the repository, applied by a command in the deploy path, which is the docker run migrate line in release.sh. If your current schema exists only because you clicked through pgAdmin once, stop and write the migrations now. It is a manageable job today and a project-ending one on viva day.",
          "A secret committed to git. When it happens, rotate first. Deleting the file and force-pushing does not un-leak anything: public repos are scraped constantly, and the credential is compromised the moment it is pushed, not the moment someone notices. Revoke and reissue at the provider, then clean history with git filter-repo or BFG, then add the file to .gitignore. In that order. Then add a pre-commit scanner such as gitleaks and let a machine do the remembering.",
          "The container that starts and immediately exits. Almost always one of three things: the app bound to 127.0.0.1 instead of 0.0.0.0, it ignored the PORT the platform assigned, or a required environment variable was missing and the process threw at boot, which, if you followed step 1, is exactly what it should do. docker logs app tells you which. Read the logs before you rewrite anything."
        ]
      },
      {
        "type": "code",
        "lang": "bash",
        "code": "git grep -nE '(localhost|127\\.0\\.0\\.1|:3000|:5173|:8000)' -- . ':!*.md' ':!package-lock.json'"
      },
      {
        "type": "quote",
        "text": "The deploy does not add polish to the project. It exposes whether the project was ever real."
      },
      {
        "type": "h2",
        "text": "Making the demo survive the viva"
      },
      {
        "type": "ol",
        "items": [
          "Seeded data. An empty deployed app is a bad demo. Write a seed script with idempotent inserts (ON CONFLICT DO NOTHING) that creates a demo user and enough realistic rows to show every feature, and run it once against production. Never demo an empty table.",
          "A known-good tag. When it works, tag it: git tag -a viva-ready -m 'demo build' && git push origin viva-ready. That commit SHA is also your image tag in GHCR. You now have a build you can name.",
          "A rollback you have actually rehearsed. Rolling back the code is one command on the server, IMAGE=ghcr.io/you/app:OLD_SHA /srv/app/release.sh, but the first time you run it must not be during the demo. Deploy something, break it on purpose, roll it back. And know the limit: rolling back the image does not roll back the database. If the bad deploy dropped a column, the old image will not bring it back, which is a good reason to keep destructive migrations for after the viva.",
          "A code freeze. Stop deploying a couple of days before the viva. A lot of demo-day failures trace back to a change pushed the night before, for reasons nobody can reconstruct at 9am.",
          "A warm-up pass. Before you walk in: open the URL, wake the free tier, confirm /healthz returns the SHA you expect, and keep a short screen recording of the working flow on your phone. Not as a substitute for the live demo, but as the thing that lets you keep talking calmly while the campus wifi does whatever campus wifi does."
        ]
      },
      {
        "type": "h2",
        "text": "The honest reason this matters"
      },
      {
        "type": "p",
        "text": "Nobody is going to give you extra marks for a Dockerfile. What deployment buys you is different and more durable: it is the first time your project has to survive without you in the room. Every assumption you made becomes visible. Every implicit dependency becomes a line in a config file. The project stops being a demonstration and becomes a system, and that shift, more than any framework on your CV, is the difference between a college project and engineering work."
      },
      {
        "type": "p",
        "text": "We think student projects should be built the way production software is built: containerised, in version control, deployed from a pipeline, from week one rather than week twelve. That is the principle Tenzok works from, because a project that has never been deployed has never really been tested. If you are staring at a working localhost and a deadline, that is the part worth fixing first, whether you do it with us or on your own. Start with the .dockerignore. Then the environment variables. The rest follows."
      }
    ],
    "faq": [
      {
        "q": "How do I deploy my final year project for free?",
        "a": "Put the frontend on a static host (Vercel, Netlify, or Cloudflare Pages), run the backend as a Docker container on a platform-as-a-service free tier, and use a managed Postgres free tier such as Neon or Supabase. The main trade-off on free backend tiers is cold starts: Render, for example, documents that its free web services spin down after inactivity and take time to wake, and other providers have their own idle policies, so check the current terms and open the URL a few minutes before any demo. Also look at the GitHub Student Developer Pack, which offers cloud credits to students who pass GitHub's verification."
      },
      {
        "q": "Do I really need Docker for a college project?",
        "a": "You do not strictly need it, but it is the cheapest way to guarantee the app runs the same on the server as on your laptop. Without a container you are relying on the hosting platform to guess your runtime, your build command, and your Node or Python version. A short Dockerfile removes all of that guessing, and it makes rollback (redeploy the previous image tag) a one-command operation. Build for the architecture your server runs: an image built on an Apple Silicon Mac is arm64 and will not start on an amd64 VPS."
      },
      {
        "q": "What is the simplest CI/CD setup for a student project?",
        "a": "A single GitHub Actions workflow with three jobs: run tests against a Postgres service container, build and push a Docker image to GitHub Container Registry tagged with the commit SHA, then SSH into your server to pull and restart that image. Secrets live in GitHub Actions secrets, never in the repo. Migrations run as a step in the deploy, from the same image, before the new container starts serving. Remember that GHCR packages are private by default, so the server needs a read-only token to pull, or the package has to be made public."
      },
      {
        "q": "I accidentally committed my .env file with API keys. What do I do?",
        "a": "Rotate the credentials at the provider first. Public repositories are scraped constantly, so the key is compromised the moment it was pushed, not when you noticed. Revoke and reissue, then remove the file from git history with git filter-repo or BFG, then add .env to .gitignore. Install a pre-commit scanner such as gitleaks so it does not happen again."
      },
      {
        "q": "Why does my deployed API work locally but fail in the browser with a CORS error?",
        "a": "Your frontend and API are now on different origins, so the browser enforces CORS. Your API must send an Access-Control-Allow-Origin header listing the deployed frontend origin exactly, including the https scheme and with no trailing slash. Drive it from an environment variable rather than hardcoding it, and make the app throw at boot if that variable is missing, because an empty origin list silently blocks every request. Do not disable CORS entirely to make the error go away."
      }
    ]
  },
  {
    "slug": "viva-questions-examiners-ask",
    "title": "12 Viva Questions Examiners Ask About Your Final Year Project",
    "excerpt": "Viva questions cluster into a few recognisable families, and in most vivas every one of them ends with the same follow-up: show me where that happens in the code.",
    "description": "The questions examiners really ask in a final year project viva, why \"I followed a tutorial\" sinks you, and how to answer all twelve from your own code.",
    "keywords": [
      "viva questions for final year project",
      "project viva preparation",
      "how to defend your project",
      "final year project viva questions and answers",
      "what to say in a project viva",
      "project defence questions",
      "capstone project viva",
      "how to answer viva questions"
    ],
    "publishedAt": "2026-07-08",
    "readingMinutes": 11,
    "tags": [
      "Final Year Projects",
      "Viva Preparation",
      "Engineering Craft"
    ],
    "body": [
      {
        "type": "p",
        "text": "Search for viva questions for final year project and you will find lists of a hundred questions with a hundred canned answers. Memorise all of them and you can still fail, because the examiner is not testing whether you can define normalisation. They are testing whether the project on the screen was built by the person sitting in front of them."
      },
      {
        "type": "p",
        "text": "Examiners are more predictable than those lists suggest. Not in format - a viva can be a ten-minute checklist or an hour of grilling, depending on your institution and your examiner - but in substance. The questions that actually move marks tend to cluster into a small number of families. I count six. The twelve questions below are drawn from those six families, and each of them has the same follow-up waiting behind it: show me where that happens in the code."
      },
      {
        "type": "p",
        "text": "That follow-up is why you cannot bluff. And it is why the examiner is really checking three things, in this order. Did you build it. Do you understand what you built. Do you know what is wrong with it. Most students prepare only for the second one and defend the project as if it were finished and perfect, which is a mistake, because an examiner who cannot find a limitation you already know about will start hunting for one you do not."
      },
      {
        "type": "h2",
        "text": "The six families every viva question comes from"
      },
      {
        "type": "ul",
        "items": [
          "Why this stack. Did you choose it, or did the tutorial choose it for you?",
          "Why this database, this model, this algorithm. Do you understand the shape of your own data?",
          "What breaks at scale. Can you name your bottleneck in one sentence?",
          "Where does it fail. Have you ever watched your own project break?",
          "What would you do differently. Can you criticise your own work without collapsing?",
          "Show me where that happens in the code. Can you navigate the repository you say you wrote?"
        ]
      },
      {
        "type": "h2",
        "text": "Why \"I followed a tutorial\" is the answer that sinks you"
      },
      {
        "type": "p",
        "text": "Not because learning from a tutorial is a sin. Everyone starts from someone else's code. The problem is what the sentence reveals: the decision was made by a person who is not in the room, and there is nobody present who can defend it. Once an examiner hears it, the rest of the viva stops being a conversation and becomes an audit."
      },
      {
        "type": "p",
        "text": "The repair is available even the night before, because you can make the decision now that you did not make then. You did not choose JWT over sessions. Fine. But you can look at what you have and say the true thing: I started from a reference implementation, here is why stateless tokens work for an app with a web and a mobile client, and here is where it hurts, because a token stays valid after logout until it expires. If I did it again I would add a deny-list in Redis. That is an engineer talking. \"I followed a tutorial\" is a passenger talking."
      },
      {
        "type": "h2",
        "text": "Prepare by writing down every decision you made, and the alternative you rejected"
      },
      {
        "type": "p",
        "text": "The single highest-leverage preparation is not re-reading your report. It is a decision log. Walk your repository and list every fork in the road you passed: language, framework, database, auth, hosting, model, loss function, threshold, even the chart library. For each one write four things: what you picked, what you rejected, why, and what it costs you. A couple of dozen rows. The examiner's questions land on rows in that table. An evening on this file is worth three evenings of re-reading your report, and any row where the honest reason is \"the tutorial did it\" is your revision list: either work out why it is defensible, or be ready to say plainly that you would choose differently now."
      },
      {
        "type": "code",
        "lang": "yaml",
        "code": "# decisions.yml - keep it beside the code, not in an appendix\n- decision: PostgreSQL as the primary store\n  rejected: MongoDB\n  because: >\n    users, orders and order_items have fixed relationships and every screen\n    reads across them. In Mongo I was writing the joins by hand in the API.\n  costs: >\n    A migration step in every feature. The one field that varies per device\n    lives in a JSONB column so I do not have to migrate for it.\n  weak_answer: \"Mongo is slow\"   # says nothing, and invites a follow-up\n\n- decision: Stateless JWT access tokens\n  rejected: Server-side sessions in Redis\n  because: >\n    A web client and an Android client hit the same API, and I did not want\n    a shared session store as a day-one dependency.\n  costs: >\n    No revocation. A stolen token stays valid until it expires. If this\n    handled money I would add a deny-list in Redis and check it per request.\n\n- decision: SMOTE applied after the train/test split\n  rejected: SMOTE on the full dataset before splitting\n  because: >\n    Oversampling first interpolates between rows that later end up on both\n    sides of the split, so the model trains on synthetic copies of its own\n    test set. The score goes up and the score means nothing.\n  costs: >\n    Validation F1 dropped once I fixed it. The lower number is the real one,\n    and the lower number is the one in my report."
      },
      {
        "type": "h2",
        "text": "The trade-off vocabulary examiners respond to"
      },
      {
        "type": "p",
        "text": "Examiners are engineers. They are listening for whether you can name what you traded away, because every real decision costs something, and a student who claims their choice has no downside has not understood the choice. Learn to speak in pairs - and use the pair that is actually true of your system. Do not reach for CAP unless your system is genuinely distributed. If your whole backend is one Postgres instance, there is no partition for you to be unavailable under, and an examiner will ask you which two nodes you had in mind."
      },
      {
        "type": "ul",
        "items": [
          "Correctness versus throughput. The order write and the stock decrement happen in one transaction, with a row lock on the stock row, so the system refuses an order rather than overselling. The cost is that concurrent checkouts on a hot item serialise behind that lock. I chose refusing over overselling.",
          "Latency versus cost. Inference runs inside the request, which keeps predictions fresh and adds a few hundred milliseconds. Precomputing nightly would serve faster and read staler.",
          "Precision versus recall. The classifier feeds a human reviewer, so a missed fraud costs more than a false alarm. I moved the threshold below 0.5 and accepted the extra alarms.",
          "Reads versus writes. Name the indexes your dashboard query actually uses, and the before-and-after time you measured on a realistically sized table; every insert pays a little for them, and on a read-heavy app that is a trade worth making. An index that no query in your codebase touches is not a trade-off, it is dead weight - and an examiner who spots it will ask what it is for.",
          "Coupling versus duplication. I kept one service and duplicated a validation rule in two places rather than build a shared package for a codebase this size."
        ]
      },
      {
        "type": "h2",
        "text": "Twelve viva questions, and how to answer them from your own code"
      },
      {
        "type": "h3",
        "text": "1. Why did you choose this stack?"
      },
      {
        "type": "p",
        "text": "The answer that sinks you is a feature list: React is component-based, Node is fast, it has a large community. Every project in the room could say that. The answer that lands names a constraint from your project and the thing you gave up to satisfy it. The shape is: the dashboard re-renders on every websocket message, so I wanted a diffing render layer instead of hand-written DOM updates, and the cost is a client bundle and a build step that a server-rendered template would not need. If you cannot name what a choice cost you, you did not make the choice."
      },
      {
        "type": "h3",
        "text": "2. Why this database?"
      },
      {
        "type": "p",
        "text": "They are asking whether you understand the shape of your data. Count your joins. If your Mongo code has three lookup stages, you have rebuilt a relational database badly, and the examiner can see it on the screen. If you did pick Mongo from a tutorial, do not defend it with \"schema-less is flexible\". Say: my access patterns turned out to be relational, here are the three aggregations that prove it, and I would use Postgres next time. That answer costs you nothing and buys you credibility for the rest of the viva."
      },
      {
        "type": "h3",
        "text": "3. What happens when ten thousand users hit this at the same time?"
      },
      {
        "type": "p",
        "text": "Do not say \"I would add load balancing and caching\". That is a sentence, not an answer. Almost every project has one thing that breaks first, and you can usually find it before the viva. Often it is a query inside a loop, a model running inference on the request thread, or an upload written to local disk so the app can never run on two machines. The shape is: the feed endpoint fetches the author for each of fifty posts, so one page is fifty-one queries, and I exhaust the connection pool long before I run out of CPU. The fix is a join, then an index, and only then a cache."
      },
      {
        "type": "code",
        "lang": "sql",
        "code": "-- Do this on a COPY of your dev database, not the one you demo from.\n--\n-- Seed first, or the experiment proves nothing. A student dev database holds\n-- a few dozen rows, and on a table that small Postgres will sequential-scan\n-- whether or not the index exists, because a seq scan of 50 rows is cheaper\n-- than walking an index. Give the planner a realistic table.\n-- (Assumes users already has rows.)\nINSERT INTO posts (title, author_id, created_at)\nSELECT 'seeded post ' || i,\n       ids.arr[1 + floor(random() * array_length(ids.arr, 1))::int],\n       now() - (random() * interval '365 days')\nFROM generate_series(1, 50000) AS i,\n     (SELECT array_agg(id) AS arr FROM users) AS ids;\n\nANALYZE posts;   -- without stats the planner is guessing\n\n-- 1. Measure BEFORE. Write down the plan node and the actual time.\nEXPLAIN ANALYZE\nSELECT p.id, p.title, u.name AS author\nFROM posts p\nJOIN users u ON u.id = p.author_id\nORDER BY p.created_at DESC\nLIMIT 50;\n-- \"Seq Scan on posts\" here means the database is reading every seeded row\n-- just to find the newest fifty.\n\n-- 2. Add the index. No DESC: Postgres walks a btree backwards for\n--    ORDER BY ... DESC, so one direction serves both. Direction only matters\n--    when you MIX directions in a multi-column index, e.g. (author_id, created_at DESC).\nCREATE INDEX posts_created_at_idx ON posts (created_at);\n\n-- 3. Measure AFTER, and say both numbers out loud in the viva:\n--    \"on 50,000 seeded rows it went from a sequential scan at N ms to an\n--     index scan backward at M ms.\" That is a viva answer.\n--    \"I would add caching\" is not.\n\n-- 4. Clean up when you are done.\nDELETE FROM posts WHERE title LIKE 'seeded post %';"
      },
      {
        "type": "h3",
        "text": "4. Show me where that happens in the code."
      },
      {
        "type": "p",
        "text": "This question can be attached to anything you just said, and it is the one that separates the two kinds of student. Prepare by tracing one request end to end, out loud: route, middleware, controller, service, query, response. Know your entry point. Know the three files that actually matter. Have the go-to-symbol shortcut in your fingers. If you claimed something in your report, be able to open the file where it is true. Fifteen seconds of scrolling and silence will undo ten minutes of good answers."
      },
      {
        "type": "h3",
        "text": "5. Break it for me. Where does it fail?"
      },
      {
        "type": "p",
        "text": "Have a failure ready to perform. Submit an empty form, upload a file that is too large, stop the database and refresh the page. Then narrate the mechanism: the upload returns 413 because I cap the body at 10MB; with the database down the API returns a 503 with a JSON error body instead of a stack trace, because the connection error is caught in the error middleware, and /healthz reports unhealthy so a load balancer would pull the instance out of rotation; the form shows a field-level error because validation lives in the schema, not the handler. If your project does not fail gracefully, say so honestly and say what you would add. A student who has watched their own project break knows strictly more than one who has only watched it work."
      },
      {
        "type": "h3",
        "text": "6. Your model is 96% accurate. Is that good?"
      },
      {
        "type": "p",
        "text": "Probably not, and the answer depends on the base rate. If 96% of your rows are the negative class, a model that predicts \"no\" every single time also scores 96%. Report precision and recall for the minority class, show the confusion matrix, and name the baseline you beat. Then say which error is expensive: in disease screening a false negative is the one that hurts, so I moved the threshold down and accepted more false positives. And be ready for the leakage question, because it is coming: did you fit the scaler or the vectoriser before or after the split? Fitting it on the full dataset before the split is one of the most common ways a student project earns a number it did not earn. Duplicate rows landing on both sides of the split, and a feature that quietly encodes the target, are the other two."
      },
      {
        "type": "h3",
        "text": "7. How is this different from what already exists?"
      },
      {
        "type": "p",
        "text": "The trap is claiming novelty you do not have. \"There is nothing like this\" is false for nearly every student project, and the examiner knows the literature better than you do. The strong answer is a scoped, honest delta: existing tools do A and B, mine does B for a context they do not cover, and the part that is genuinely mine is the pipeline in the middle. Bounding your claim is not weakness. An examiner who catches you overclaiming once will spend the rest of the viva testing everything else you said."
      },
      {
        "type": "h3",
        "text": "8. Which parts of this did you write yourself?"
      },
      {
        "type": "p",
        "text": "Ask yourself this first, file by file, before someone else does. Nobody expects you to have written the ORM, the auth library or the charting code, and using an AI assistant is not the crime. Not knowing what it produced is. The answer that works is boring and specific: the schema, the matching logic in this service and the retry logic here are mine; the auth middleware started from the framework's example and I changed the token lifetime; the UI components come from a library. Then be able to defend every line you just claimed."
      },
      {
        "type": "h3",
        "text": "9. What is the limitation of your project?"
      },
      {
        "type": "p",
        "text": "This is a gift, and students throw it away by getting defensive or by offering a fake limitation like \"the UI could be prettier\". Name a real one in engineering terms, with the reason it exists and the cost of fixing it. The shape is: the recommender is trained on a few thousand ratings from a few hundred users, so it can say nothing useful about a brand-new user, which is a cold start problem; I fall back to popularity, which is honest but not personalised; fixing it properly needs content-based features on the item side and metadata I do not have. Three sentences that show you know the boundary of your own work. The limitation you name yourself is a finding. The limitation the examiner finds is a hole."
      },
      {
        "type": "h3",
        "text": "10. What was the hardest bug you fixed?"
      },
      {
        "type": "p",
        "text": "This one is hard to fake, because the follow-up is always show me the commit. Have one ready, know its hash, and tell it as a story with a mechanism in it: the symptom, what you believed was happening, how you found out you were wrong, and what was actually causing it. \"Uploads worked locally and failed in production because the container filesystem was read-only and I was writing temp files into the working directory\" is a real answer, and git log --oneline followed by git show on the fix will back it up in five seconds. \"There were many bugs and I solved them all\" is an admission that you did not build it."
      },
      {
        "type": "h3",
        "text": "11. How did you test this?"
      },
      {
        "type": "p",
        "text": "If the honest answer is that you clicked around, say that, and then say what you would test first and why. Better: know your riskiest function and have one test sitting on it. The examiner is not counting tests. They are checking whether you know which part of your own system you do not trust. Saying \"the date-range filter is the piece I am least sure of, because timezone handling crosses three layers\" scores higher than any coverage percentage."
      },
      {
        "type": "h3",
        "text": "12. What would you do differently if you started again?"
      },
      {
        "type": "p",
        "text": "Have three answers, ranked, and make at least one of them architectural rather than cosmetic. \"I would use TypeScript\" is fine but small. \"I would put file processing behind a queue instead of doing it inside the request, because that one decision is the reason I cannot scale the API horizontally\" is an engineer's answer. This is the question where the examiner decides whether you learned anything. Never say \"nothing, I am happy with it\"."
      },
      {
        "type": "h2",
        "text": "Rehearse by having someone open a random file and ask what it does"
      },
      {
        "type": "p",
        "text": "Three days before the viva, hand your laptop to a friend or a labmate with two rules. They pick the file, not you. And they are allowed to ask \"why is this here\" twice in a row. Anything you cannot explain in two sentences goes on a list. Most of that list you simply learn. Some of it is dead code left over from an earlier approach, and \"that was a leftover, so I removed it\" is a legitimate and even good answer - as long as you remove it safely, which is not what a panicking student does the night before."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "Before you delete anything this close to a submission: commit or branch first, so you can get back. Only remove code that nothing references - grep for the symbol, do not trust your memory. Run the app afterwards and click the path that code sat on. And check your report. If the report you have already submitted describes the thing you are about to remove, do not remove it - learn it. An examiner holding a report that describes code which is not in the repository will spend the rest of the viva on exactly that."
      },
      {
        "type": "code",
        "lang": "bash",
        "code": "# The viva question generator: a random tracked source file, picked by someone who is not you.\ngit ls-files '*.py' '*.ts' '*.tsx' '*.java' '*.sql' | shuf -n 1\n\n# macOS has no shuf in the stock userland (it is gshuf after `brew install coreutils`):\n#   git ls-files '*.py' '*.ts' '*.tsx' '*.java' '*.sql' | sort -R | head -1\n# PowerShell (keep the extension filter, or it will hand you package-lock.json):\n#   git ls-files '*.py' '*.ts' '*.tsx' '*.java' '*.sql' | Get-Random\n\n# For any line you cannot explain: when did it arrive, and what arrived with it?\ngit log -1 --format='%h %ad %s' -- src/api/auth.py\n\n# -S is the pickaxe: it finds the commits where this string appeared or vanished,\n# which is usually the commit that reminds you why the code exists.\ngit log -S 'verify_token(' --oneline"
      },
      {
        "type": "p",
        "text": "Underneath all twelve questions there is one question. The examiner is not asking you to defend the project. They are asking whether there is an engineer attached to it. A small project with a known bottleneck, a named failure mode, an honest limitation and a rejected alternative behind every choice reads as engineered. A large project whose author cannot say why the database is what it is does not. We think a project you can defend is a side effect of a project that was actually engineered - which is why, when we build with students at Tenzok, the decision log belongs beside the code, not in an appendix written the week before the viva."
      }
    ],
    "faq": [
      {
        "q": "What questions are asked in a final year project viva?",
        "a": "Formats vary a lot by institution, but most of the questions that carry marks fall into six families: why you chose this stack, why this database or model, what breaks at scale, where the project fails, what you would do differently, and show me where that happens in the code. Definitions and theory questions do come up, but the marks move on the why questions, and each one can be followed by a request to open the relevant file."
      },
      {
        "q": "How do I prepare for a project viva in one day?",
        "a": "Do three things. Write a decision log: every choice you made, the alternative you rejected, why, and what it costs. Find the one thing in your project that breaks first - seed your dev database to a realistic size, run your slowest query under EXPLAIN ANALYZE, and read the plan - so you can name your bottleneck in a sentence. Then have someone open three random files in your repo and ask what each one does. Anything you cannot explain, learn it."
      },
      {
        "q": "What should I say if I do not know the answer in a viva?",
        "a": "Say you do not know, then say how you would find out. \"I have not measured that. I would put a timer around the inference call and check whether the latency is in the model or in the database round trip\" is a strong answer. Bluffing is fatal because the follow-up is always show me, and the examiner has already decided to ask it."
      },
      {
        "q": "Is it bad to admit limitations in your project viva?",
        "a": "The opposite. A limitation you name yourself, in engineering terms, with the reason it exists and the cost of fixing it, is evidence that you understand the boundary of your own work. A limitation the examiner discovers is a hole in your defence. Just make it a real one, like a cold start problem or a missing token revocation path, not \"the UI could be prettier\"."
      },
      {
        "q": "How do I answer \"why did you choose this technology\"?",
        "a": "Give the constraint, the rejected alternative, and the cost. Not \"React is popular and has a large community\", but \"the dashboard re-renders on every websocket message, so I wanted a diffing render layer rather than hand-written DOM updates, and I pay for that with a larger bundle and a build step\". If you cannot name what the choice cost you, the examiner will conclude you did not make it."
      }
    ]
  },
  {
    "slug": "spring-boot-microservices-capstone",
    "title": "Spring Boot Microservices Project: What to Build, What to Skip",
    "excerpt": "Most Spring Boot microservices projects are three CRUD apps in Docker with a Eureka server; here is what actually makes it a distributed-systems project, and what to cut.",
    "description": "A Spring Boot microservices project only earns the grade if it survives failure. Idempotent Kafka consumers, an outbox, a saga that really refunds.",
    "keywords": [
      "spring boot microservices project",
      "microservices final year project",
      "saga pattern spring boot",
      "idempotent kafka consumer",
      "spring boot kafka dead letter queue",
      "transactional outbox spring boot",
      "distributed tracing spring boot",
      "java capstone project ideas"
    ],
    "publishedAt": "2026-07-14",
    "readingMinutes": 13,
    "tags": [
      "Spring Boot",
      "Microservices",
      "Kafka",
      "Capstone"
    ],
    "body": [
      {
        "type": "p",
        "text": "Search \"spring boot microservices project\" and you get the same architecture forty times over: an order service, a user service, a product service, each with its own Postgres container, a Eureka server, a Spring Cloud Gateway in front, and a README diagram with a lot of arrows. Every service does CRUD. Every call between services is a synchronous REST call. Nothing ever fails."
      },
      {
        "type": "p",
        "text": "That project takes eight weeks and answers exactly one question in the viva: can you configure Spring Boot three times? The question your examiner will actually ask is \"why is this not a monolith?\" If the honest answer is \"because the project title says microservices\", the demo is already over."
      },
      {
        "type": "p",
        "text": "So this post covers two things. First, when microservices are the wrong choice for a capstone, which is most of the time. Second, if you are doing it anyway, what turns three CRUD apps in Docker into a real distributed-systems project: idempotent consumers, a transactional outbox, a saga whose compensation actually fires, a dead-letter topic, and one trace ID running through all of it. Plus a list of things everyone builds that earn nothing."
      },
      {
        "type": "h2",
        "text": "Should your final year project be microservices at all?"
      },
      {
        "type": "p",
        "text": "Probably not. Microservices solve an organisational problem: many teams deploying independently without stepping on each other. You are one to four people shipping once, so you have none of the problems microservices solve and all of the costs they impose. A modular monolith with clear package boundaries, one database, real transactions and a proper test suite is a better piece of engineering than five services that fall over when one of them restarts, and choosing it on purpose scores better than a distributed system you cannot explain. If the real contribution of your project is somewhere else, an ML model or a compiler or a mobile app, build the monolith, ship the contribution, and spend the six weeks you saved on evaluation."
      },
      {
        "type": "h2",
        "text": "What turns three CRUD apps in Docker into a distributed-systems project"
      },
      {
        "type": "p",
        "text": "There is one honest reason to build microservices as a capstone: the project is about distributed systems. Partial failure, message ordering, delivery semantics, eventual consistency. That is a legitimate and interesting subject, but then the project has to actually be about those things. The property that makes it real is singular: one business operation spans more than one service and more than one database, and it must end in a consistent state even when a service dies halfway through. Everything below exists to serve that sentence."
      },
      {
        "type": "ul",
        "items": [
          "Services communicate asynchronously over Kafka, not by calling each other's REST endpoints and blocking.",
          "Every consumer is idempotent, because Kafka will deliver the same record twice and your grader can force it to.",
          "Every event leaves a service through an outbox table, so a commit and a publish cannot disagree.",
          "A business operation spanning services is modelled as a saga with explicit compensation, not with @Transactional across HTTP.",
          "Records that can never succeed land in a dead-letter topic instead of being silently dropped, which is what Spring does by default.",
          "One request produces one trace across all services, so you can point at a screenshot and say where the 400ms went."
        ]
      },
      {
        "type": "p",
        "text": "The domain does not need to be original; it needs one operation that cannot fit in a single transaction. Placing an order is the classic: debit the customer's wallet in the payment service, reserve stock in the inventory service, confirm the order in the order service. Three services, three databases, one outcome that has to be all-or-nothing. Three services is enough, and a notification service adds YAML and no argument. Notice why the tutorial version breaks: OrderController calls PaymentClient.debit() over HTTP, then InventoryClient.reserve() over HTTP. If the debit succeeds and the reserve call times out, you do not know whether stock was reserved. Retry and you may reserve twice; give up and you have taken the money for nothing. Kafka does not fix that by itself, but it gives you a durable log to recover from, and recovery is the thing you can demonstrate."
      },
      {
        "type": "h2",
        "text": "Your Kafka consumer will run twice. Here is the wrong version."
      },
      {
        "type": "p",
        "text": "Kafka gives you at-least-once delivery, and Spring's listener container commits offsets after the whole batch from a poll has been processed (AckMode.BATCH is the default, not per record). If the process dies after your database commit and before the offset commit, every record in that batch, including the one you just handled, is delivered again on restart. If your listener throws after a partial side effect, the error handler replays the entire method. Both are easy to reproduce and both will happen to you."
      },
      {
        "type": "code",
        "lang": "java",
        "code": "// WRONG: the debit is not idempotent.\n// Kafka redelivers on restart and this method debits the wallet a second time.\n@Component\npublic class PaymentListener {\n\n    private final WalletRepository wallets;\n\n    public PaymentListener(WalletRepository wallets) {\n        this.wallets = wallets;\n    }\n\n    @KafkaListener(topics = \"order.created\", groupId = \"payment-service\")\n    public void onOrderCreated(OrderCreated event) {\n        Wallet wallet = wallets.findByUserId(event.userId()).orElseThrow();\n        wallet.setBalance(wallet.getBalance().subtract(event.amount()));\n        wallets.save(wallet);\n        // Crash here -> the offset is never committed -> on restart the same\n        // record is delivered again -> the customer pays twice.\n    }\n}"
      },
      {
        "type": "h2",
        "text": "The idempotent consumer, properly"
      },
      {
        "type": "p",
        "text": "The fix is not clever. Give every event a UUID when it is published, and record in the consumer's own database that this consumer has handled that UUID. Do the recording and the business write in the same local transaction. If the insert conflicts, you have seen the event before, so stop. The DDL below is Postgres. On MySQL the equivalent is INSERT IGNORE; on H2 use MERGE, or better, run Postgres in Testcontainers, which you want anyway for the integration test in week six."
      },
      {
        "type": "code",
        "lang": "sql",
        "code": "-- Postgres.\nCREATE TABLE processed_event (\n    event_id     UUID        NOT NULL,\n    consumer     VARCHAR(64) NOT NULL,\n    processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n    PRIMARY KEY (event_id, consumer)\n);"
      },
      {
        "type": "code",
        "lang": "java",
        "code": "// The contract. One record per file in a shared module; shown together here.\n// Every event carries its own id: that id is what consumers dedupe on and what\n// the outbox row is keyed by.\npublic record OrderCreated(UUID eventId, UUID orderId, UUID userId,\n                          String sku, int quantity, BigDecimal amount) {}\npublic record PaymentCompleted(UUID eventId, UUID paymentId, UUID orderId,\n                              UUID userId, BigDecimal amount) {}\npublic record PaymentFailed(UUID eventId, UUID orderId, UUID userId, String reason) {}\npublic record ReserveStock(UUID eventId, UUID orderId, String sku, int quantity) {}\npublic record StockReserved(UUID eventId, UUID orderId, String sku, int quantity) {}\npublic record StockReservationFailed(UUID eventId, UUID orderId, String reason) {}\npublic record RefundPayment(UUID eventId, UUID orderId, UUID paymentId, UUID userId) {}\npublic record PaymentRefunded(UUID eventId, UUID orderId, UUID paymentId) {}\n\n// Entities (Wallet, Payment, SagaState, Order, OutboxEvent, ProcessedEvent) are\n// ordinary JPA classes and are not shown.\n\npublic interface ProcessedEventRepository\n        extends JpaRepository<ProcessedEvent, ProcessedEventId> {\n\n    // Returns 1 the first time, 0 for a redelivery. Postgres syntax.\n    @Modifying\n    @Query(value = \"\"\"\n            INSERT INTO processed_event (event_id, consumer)\n            VALUES (:eventId, :consumer)\n            ON CONFLICT DO NOTHING\n            \"\"\", nativeQuery = true)\n    int markProcessed(@Param(\"eventId\") UUID eventId, @Param(\"consumer\") String consumer);\n}\n\npublic interface WalletRepository extends JpaRepository<Wallet, UUID> {\n\n    @Lock(LockModeType.PESSIMISTIC_WRITE)\n    @Query(\"select w from Wallet w where w.userId = :userId\")\n    Optional<Wallet> lockByUserId(@Param(\"userId\") UUID userId);\n}\n\n@Component\npublic class PaymentListener {\n\n    private static final Logger log = LoggerFactory.getLogger(PaymentListener.class);\n    private static final String CONSUMER = \"payment-service\";\n\n    private final ProcessedEventRepository processed;\n    private final WalletRepository wallets;\n    private final PaymentRepository payments;\n    private final Outbox outbox;\n\n    public PaymentListener(ProcessedEventRepository processed,\n                           WalletRepository wallets,\n                           PaymentRepository payments,\n                           Outbox outbox) {\n        this.processed = processed;\n        this.wallets = wallets;\n        this.payments = payments;\n        this.outbox = outbox;\n    }\n\n    // Dedupe row + debit + payment row + outbox row commit together, or not at all.\n    @KafkaListener(topics = \"order.created\", groupId = CONSUMER)\n    @Transactional\n    public void onOrderCreated(OrderCreated event) {\n        if (processed.markProcessed(event.eventId(), CONSUMER) == 0) {\n            log.info(\"Duplicate delivery of {}, skipping\", event.eventId());\n            return;\n        }\n\n        Wallet wallet = wallets.lockByUserId(event.userId())\n                .orElseThrow(() -> new UnknownWalletException(event.userId()));\n\n        if (wallet.getBalance().compareTo(event.amount()) < 0) {\n            UUID rejected = UUID.randomUUID();\n            outbox.publish(rejected, \"payment.failed\", event.orderId().toString(),\n                    new PaymentFailed(rejected, event.orderId(),\n                            event.userId(), \"INSUFFICIENT_FUNDS\"));\n            return;\n        }\n\n        wallet.setBalance(wallet.getBalance().subtract(event.amount()));\n        wallets.save(wallet);\n\n        // The debit is a row, not just a smaller balance. This id is what the\n        // refund will point at.\n        Payment payment = payments.save(new Payment(UUID.randomUUID(), event.orderId(),\n                event.userId(), event.amount(), PaymentStatus.DEBITED));\n\n        UUID eventId = UUID.randomUUID();\n        outbox.publish(eventId, \"payment.completed\", event.orderId().toString(),\n                new PaymentCompleted(eventId, payment.getId(), event.orderId(),\n                        event.userId(), event.amount()));\n    }\n}"
      },
      {
        "type": "p",
        "text": "Three things in that method carry weight. First, the debit writes a payment row. \"Reverse payment 7f3a\" is a very different instruction from \"add 400 back to a wallet\", and the second one cannot be made safe. Second, the topic keys: key each topic by the id of the thing its consumer is going to mutate. order.created and payment.refund both end with the payment service changing one wallet, so both are keyed by userId, which puts every event touching that wallet on one partition, in order, behind one consumer thread. payment.completed, payment.failed, stock.reserved and stock.reservation.failed all mutate one saga row, so they are keyed by orderId. Third, partitioning is not a lock. A rebalance can hand a partition to another instance while your listener is still running, so the wallet is read with PESSIMISTIC_WRITE anyway. Read-modify-write on a balance with no lock is a lost update, and it is the bug most likely to actually show up in your demo."
      },
      {
        "type": "callout",
        "tone": "warn",
        "text": "A plain KafkaTemplate.send() is not enrolled in your database transaction, in either direction. Send before the commit and a rollback still leaves the event published: downstream services act on a debit that never happened. Send after the commit and a crash in between loses the event entirely. The second failure is worse than it looks once you have a dedupe table, because the dedupe table makes it permanent: on redelivery, markProcessed returns 0, the listener returns early, payment.completed is never re-emitted, the wallet stays debited and the saga waits forever. Dedupe-and-return is only safe if the outgoing event is durable. That is what the next section is for, and it is why the code above calls outbox.publish rather than kafka.send."
      },
      {
        "type": "h2",
        "text": "The outbox is what makes the dedupe table safe"
      },
      {
        "type": "p",
        "text": "The outbox is one table and one poller. Inside the listener transaction you do not talk to Kafka at all; you write the event as a row. The debit, the dedupe row and the outbox row commit together or none of them do, so an event cannot exist without the write it describes, and a write cannot exist without the event. A separate poller reads unsent rows and publishes them. If the poller dies after the broker acks but before it marks the row sent, it publishes the same event again on restart, and the consumer's dedupe table absorbs it. Every hop is at-least-once and every consumer is idempotent, so the loop closes. Make the outbox row id the event id: that one decision is what lets the saga sweeper re-drive a command later without minting a new id."
      },
      {
        "type": "code",
        "lang": "sql",
        "code": "-- Postgres. FOR UPDATE SKIP LOCKED in the poller query is what lets you run\n-- more than one instance without publishing the same row twice.\nCREATE TABLE outbox_event (\n    id            UUID         PRIMARY KEY,   -- this IS the event id inside the payload\n    topic         VARCHAR(128) NOT NULL,\n    partition_key VARCHAR(64)  NOT NULL,\n    payload       TEXT         NOT NULL,\n    payload_type  VARCHAR(256) NOT NULL,\n    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),\n    sent_at       TIMESTAMPTZ\n);\n\nCREATE INDEX outbox_unsent ON outbox_event (created_at) WHERE sent_at IS NULL;"
      },
      {
        "type": "code",
        "lang": "java",
        "code": "public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {\n\n    @Query(value = \"\"\"\n            SELECT * FROM outbox_event\n            WHERE sent_at IS NULL\n            ORDER BY created_at\n            LIMIT 100\n            FOR UPDATE SKIP LOCKED\n            \"\"\", nativeQuery = true)\n    List<OutboxEvent> lockUnsent();\n\n    // Used by the saga sweeper to re-publish a command with its original id.\n    @Modifying\n    @Query(\"update OutboxEvent e set e.sentAt = null where e.id = :id\")\n    int markUnsent(@Param(\"id\") UUID id);\n}\n\n@Component\npublic class Outbox {\n\n    private final OutboxEventRepository repo;\n    private final ObjectMapper mapper;\n\n    public Outbox(OutboxEventRepository repo, ObjectMapper mapper) {\n        this.repo = repo;\n        this.mapper = mapper;\n    }\n\n    // Called from inside a listener's @Transactional method. No I/O, just a row.\n    public void publish(UUID eventId, String topic, String key, Object payload) {\n        try {\n            repo.save(new OutboxEvent(eventId, topic, key,\n                    mapper.writeValueAsString(payload), payload.getClass().getName()));\n        } catch (JsonProcessingException e) {\n            throw new IllegalStateException(\"Cannot serialise \" + payload, e);\n        }\n    }\n}\n\n@Component\npublic class OutboxPoller {\n\n    private final OutboxEventRepository repo;\n    private final KafkaTemplate<String, Object> kafka;\n    private final ObjectMapper mapper;\n\n    public OutboxPoller(OutboxEventRepository repo,\n                        KafkaTemplate<String, Object> kafka,\n                        ObjectMapper mapper) {\n        this.repo = repo;\n        this.kafka = kafka;\n        this.mapper = mapper;\n    }\n\n    // Needs @EnableScheduling on the application class.\n    @Scheduled(fixedDelay = 500)\n    @Transactional\n    public void flush() {\n        for (OutboxEvent row : repo.lockUnsent()) {\n            try {\n                Object payload = mapper.readValue(row.getPayload(),\n                        Class.forName(row.getPayloadType()));\n                // Block on the ack: mark it sent only once the broker has it.\n                kafka.send(row.getTopic(), row.getPartitionKey(), payload)\n                        .get(5, TimeUnit.SECONDS);\n                row.setSentAt(Instant.now());   // managed entity: flushes on commit\n            } catch (Exception e) {\n                // Roll the batch back. The rows stay unsent and go again next tick.\n                // Anything already published gets published twice; consumers dedupe.\n                throw new IllegalStateException(\"Outbox publish failed for \" + row.getId(), e);\n            }\n        }\n    }\n}"
      },
      {
        "type": "h2",
        "text": "The saga: how do you refund a payment when inventory says no?"
      },
      {
        "type": "p",
        "text": "There is no rollback across three databases. What you have instead is a saga: a sequence of local transactions, each with a compensating transaction that semantically undoes it. Money debited is not un-debited by a ROLLBACK; it is refunded by a second, forward transaction. Choose orchestration over choreography. In choreography each service listens and reacts and the flow lives nowhere. In orchestration one service owns a persisted state machine and issues commands, which is easier to reason about, easier to draw, and easier to recover after a crash, because the state is in a table you can query in front of the examiner."
      },
      {
        "type": "code",
        "lang": "java",
        "code": "public interface SagaStateRepository extends JpaRepository<SagaState, UUID> {\n\n    @Lock(LockModeType.PESSIMISTIC_WRITE)\n    @Query(\"select s from SagaState s where s.orderId = :orderId\")\n    Optional<SagaState> lockByOrderId(@Param(\"orderId\") UUID orderId);\n}\n\n// Order service. Step: AWAITING_PAYMENT, RESERVING_STOCK, COMPLETED,\n// COMPENSATING, COMPENSATED, FAILED, STALLED.\n@Component\npublic class OrderSaga {\n\n    private static final String CONSUMER = \"order-service\";\n\n    private final SagaStateRepository sagas;\n    private final OrderRepository orders;\n    private final Outbox outbox;\n\n    public OrderSaga(SagaStateRepository sagas, OrderRepository orders, Outbox outbox) {\n        this.sagas = sagas;\n        this.orders = orders;\n        this.outbox = outbox;\n    }\n\n    // A row lock, not just a step check. These listeners are bound to different\n    // topics, so they run on different container threads and can arrive together.\n    // Empty means the saga is not in the step this event belongs to: ignore it.\n    private Optional<SagaState> lockIfAt(UUID orderId, Step expected) {\n        return sagas.lockByOrderId(orderId).filter(saga -> saga.getStep() == expected);\n    }\n\n    @KafkaListener(topics = \"payment.completed\", groupId = CONSUMER)\n    @Transactional\n    public void onPaymentCompleted(PaymentCompleted event) {\n        lockIfAt(event.orderId(), Step.AWAITING_PAYMENT).ifPresent(saga -> {\n            saga.setPaymentId(event.paymentId());   // what a refund would point at\n            saga.setStep(Step.RESERVING_STOCK);\n\n            UUID commandId = UUID.randomUUID();\n            saga.setLastCommandId(commandId);       // the sweeper re-drives THIS id\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n\n            outbox.publish(commandId, \"stock.reserve\", saga.getSku(),\n                    new ReserveStock(commandId, saga.getOrderId(),\n                            saga.getSku(), saga.getQuantity()));\n        });\n    }\n\n    // The likeliest failure in the whole system, and the one most projects forget:\n    // the customer does not have the money.\n    @KafkaListener(topics = \"payment.failed\", groupId = CONSUMER)\n    @Transactional\n    public void onPaymentFailed(PaymentFailed event) {\n        lockIfAt(event.orderId(), Step.AWAITING_PAYMENT).ifPresent(saga -> {\n            saga.setStep(Step.FAILED);              // terminal: nothing was debited\n            saga.setFailureReason(event.reason());\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n            close(saga.getOrderId(), OrderStatus.REJECTED);\n        });\n    }\n\n    @KafkaListener(topics = \"stock.reserved\", groupId = CONSUMER)\n    @Transactional\n    public void onStockReserved(StockReserved event) {\n        lockIfAt(event.orderId(), Step.RESERVING_STOCK).ifPresent(saga -> {\n            saga.setStep(Step.COMPLETED);\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n            close(saga.getOrderId(), OrderStatus.CONFIRMED);\n        });\n    }\n\n    // Compensation trigger: the money is gone and the stock is not there.\n    @KafkaListener(topics = \"stock.reservation.failed\", groupId = CONSUMER)\n    @Transactional\n    public void onStockReservationFailed(StockReservationFailed event) {\n        lockIfAt(event.orderId(), Step.RESERVING_STOCK).ifPresent(saga -> {\n            saga.setStep(Step.COMPENSATING);\n            saga.setFailureReason(event.reason());\n\n            UUID commandId = UUID.randomUUID();\n            saga.setLastCommandId(commandId);\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n\n            // Keyed by userId, not orderId: this command mutates a wallet, and every\n            // event that mutates one wallet must land on one partition, in order.\n            outbox.publish(commandId, \"payment.refund\", saga.getUserId().toString(),\n                    new RefundPayment(commandId, saga.getOrderId(),\n                            saga.getPaymentId(), saga.getUserId()));\n        });\n    }\n\n    @KafkaListener(topics = \"payment.refunded\", groupId = CONSUMER)\n    @Transactional\n    public void onPaymentRefunded(PaymentRefunded event) {\n        lockIfAt(event.orderId(), Step.COMPENSATING).ifPresent(saga -> {\n            saga.setStep(Step.COMPENSATED);         // terminal, and the money is back\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n            close(saga.getOrderId(), OrderStatus.REJECTED);\n        });\n    }\n\n    private void close(UUID orderId, OrderStatus status) {\n        Order order = orders.findById(orderId).orElseThrow();\n        order.setStatus(status);                    // same database, same transaction\n        orders.save(order);\n    }\n}"
      },
      {
        "type": "p",
        "text": "Two details to defend out loud. The pessimistic lock on the saga row is not decoration: payment.completed and stock.reservation.failed arrive on different partitions and therefore different container threads, so without the lock both handlers can read the same pre-transition step and both act. That is the identical lost update the wallet has, committed in the one component whose state must not be corrupted. And the order service starts the saga the same way the payment service continues it: in one transaction it writes the Order row as PENDING, the SagaState row as AWAITING_PAYMENT with lastCommandId set to the OrderCreated event id, and the outbox row carrying that event, keyed by userId. The compensating step lives in the payment service and is idempotent for exactly the same reason the debit was."
      },
      {
        "type": "code",
        "lang": "java",
        "code": "// Payment service. This method lives inside the PaymentListener class shown\n// earlier: same dedupe table, same wallet lock, same outbox.\n@KafkaListener(topics = \"payment.refund\", groupId = CONSUMER)\n@Transactional\npublic void onRefundPayment(RefundPayment cmd) {\n    if (processed.markProcessed(cmd.eventId(), CONSUMER) == 0) {\n        return;   // the sweeper re-drove the command; this refund already happened\n    }\n\n    // The command names the payment. The payment row holds the amount, so a stale\n    // saga cannot make you refund the wrong number.\n    Payment payment = payments.findById(cmd.paymentId())\n            .orElseThrow(() -> new IllegalStateException(\"No payment \" + cmd.paymentId()));\n    if (payment.getStatus() == PaymentStatus.REFUNDED) {\n        return;   // second line of defence: the payment row itself\n    }\n\n    Wallet wallet = wallets.lockByUserId(cmd.userId())\n            .orElseThrow(() -> new UnknownWalletException(cmd.userId()));\n    wallet.setBalance(wallet.getBalance().add(payment.getAmount()));\n    wallets.save(wallet);\n\n    payment.setStatus(PaymentStatus.REFUNDED);\n    payments.save(payment);\n\n    UUID eventId = UUID.randomUUID();\n    outbox.publish(eventId, \"payment.refunded\", cmd.orderId().toString(),\n            new PaymentRefunded(eventId, cmd.orderId(), cmd.paymentId()));\n}"
      },
      {
        "type": "p",
        "text": "A saga is not atomic, and you will be asked about it. Between the debit and the refund there is a window, possibly seconds long, where the customer's balance is wrong. That is eventual consistency: a property of your system, not a bug you failed to fix. Say it plainly, then say what you did about visibility. The order sits in PENDING for the whole window and the UI never shows it as confirmed, so no user-visible decision is ever made on a state the system has not yet reconciled."
      },
      {
        "type": "h3",
        "text": "What if the orchestrator itself crashes?"
      },
      {
        "type": "p",
        "text": "The saga state is persisted before any command leaves the outbox, so a crash loses nothing. What a crash can do is leave a saga parked: the inventory service was down long enough for its record to be dropped, and no reply is ever coming. So put a number on it. The step timeout is thirty seconds, the sweeper runs every ten, and after five re-drives the saga is marked STALLED and appears on an admin page for a human. Those are the numbers, and they are the ones to quote when the examiner asks how long a wrong balance can persist. The critical line is the re-drive itself: it republishes the command you already issued, under its original event id. A fresh id walks straight past the consumer's dedupe table and reserves the stock, or refunds the money, a second time. Your own retry would defeat your own idempotency."
      },
      {
        "type": "code",
        "lang": "java",
        "code": "// Add to SagaStateRepository:\n//\n//   @Query(value = \"\"\"\n//           SELECT * FROM saga_state\n//           WHERE step IN ('AWAITING_PAYMENT', 'RESERVING_STOCK', 'COMPENSATING')\n//             AND updated_at < :cutoff\n//           ORDER BY updated_at LIMIT 100\n//           FOR UPDATE SKIP LOCKED\n//           \"\"\", nativeQuery = true)\n//   List<SagaState> lockStuck(@Param(\"cutoff\") Instant cutoff);\n\n@Component\npublic class SagaSweeper {\n\n    // The saga timeout. Write it down: the examiner will ask for the number.\n    private static final Duration STEP_TIMEOUT = Duration.ofSeconds(30);\n    private static final int MAX_ATTEMPTS = 5;\n\n    private final SagaStateRepository sagas;\n    private final OutboxEventRepository outbox;\n\n    public SagaSweeper(SagaStateRepository sagas, OutboxEventRepository outbox) {\n        this.sagas = sagas;\n        this.outbox = outbox;\n    }\n\n    @Scheduled(fixedDelay = 10_000)\n    @Transactional\n    public void redriveStuckSagas() {\n        Instant cutoff = Instant.now().minus(STEP_TIMEOUT);\n        for (SagaState saga : sagas.lockStuck(cutoff)) {\n            if (saga.getAttempts() >= MAX_ATTEMPTS) {\n                saga.setStep(Step.STALLED);   // a human looks at it on the admin page\n                sagas.save(saga);\n                continue;\n            }\n\n            // Re-drive the command we already issued, with the SAME event id.\n            // A new id would slip past the consumer's dedupe table and reserve the\n            // stock, or refund the money, twice.\n            outbox.markUnsent(saga.getLastCommandId());\n            saga.setAttempts(saga.getAttempts() + 1);\n            saga.setUpdatedAt(Instant.now());\n            sagas.save(saga);\n        }\n    }\n}"
      },
      {
        "type": "h2",
        "text": "The dead-letter topic: what Spring actually does by default"
      },
      {
        "type": "p",
        "text": "You will read that a poison message blocks the partition forever. It does not. Spring Boot configures DefaultErrorHandler with FixedBackOff(0, 9): ten delivery attempts, no delay, and then the default recoverer logs the record at ERROR, the container commits the offset, and the consumer moves on. The partition keeps flowing. What actually happens is worse than a hang, because a hang is something you notice. Your event is gone, the only evidence is a stack trace in a container log nobody is tailing, and the saga waiting on it sits in AWAITING_PAYMENT until the sweeper gives up on it. The dead-letter topic is not there to unblock the partition. It is there so the record still exists after everything else has failed."
      },
      {
        "type": "code",
        "lang": "java",
        "code": "// Spring Boot 3.x. ExponentialBackOffWithMaxRetries works across the whole Boot 3\n// line; ExponentialBackOff.setMaxAttempts() only exists from Boot 3.2.\n@Configuration\npublic class KafkaErrorHandlingConfig {\n\n    @Bean\n    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {\n        // Name the DLT explicitly so the topic name is predictable and you can create\n        // it up front with the same partition count as the source topic. The recoverer\n        // reuses the source partition number, so a DLT with fewer partitions throws.\n        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(\n                template,\n                (record, exception) ->\n                        new TopicPartition(record.topic() + \".DLT\", record.partition()));\n\n        ExponentialBackOffWithMaxRetries backOff = new ExponentialBackOffWithMaxRetries(3);\n        backOff.setInitialInterval(500L);\n        backOff.setMultiplier(2.0);\n        backOff.setMaxInterval(10_000L);\n\n        DefaultErrorHandler handler = new DefaultErrorHandler(recoverer, backOff);\n\n        // A wallet that does not exist will not start existing on the third attempt.\n        handler.addNotRetryableExceptions(UnknownWalletException.class);\n        return handler;\n    }\n}"
      },
      {
        "type": "p",
        "text": "Boot picks up a single CommonErrorHandler bean automatically, so that is all the wiring. Two things to add. Configure ErrorHandlingDeserializer on the consumer, otherwise a record whose JSON does not parse fails before your listener is ever called and the error handler has nothing to recover. Then build the boring part that turns a config file into a project: an admin endpoint that lists what is sitting in each DLT and why, reading the exception class and message out of the headers Spring adds to the dead-lettered record, alongside the sagas the sweeper has marked STALLED. That page is the one screenshot in your report that proves you thought about the day after the demo."
      },
      {
        "type": "h2",
        "text": "Distributed tracing: one trace ID through three services"
      },
      {
        "type": "p",
        "text": "Add micrometer-tracing-bridge-brave and zipkin-reporter-brave, run Zipkin in Docker, and turn on Kafka observation. Spring propagates the trace context in the Kafka record headers, so one order becomes one trace spanning the HTTP call, the producer, the consumer and the database. Boot puts traceId and spanId into the log pattern for you once a tracer is on the classpath; the pattern below is what to set if you have overridden it yourself. One honest caveat the outbox introduces: the poller publishes on a scheduled thread, so the producer span is not a child of the request that wrote the row unless you store the W3C traceparent value in the outbox row and set it back on the ProducerRecord when you publish. Do that, or say in the report that you know the trace breaks at the outbox and why."
      },
      {
        "type": "code",
        "lang": "yaml",
        "code": "management:\n  tracing:\n    sampling:\n      probability: 1.0   # sample everything; this is a demo, not production\n  zipkin:\n    tracing:\n      endpoint: http://localhost:9411/api/v2/spans\n\nspring:\n  kafka:\n    template:\n      observation-enabled: true\n    listener:\n      observation-enabled: true\n\nlogging:\n  pattern:\n    level: \"%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]\""
      },
      {
        "type": "h2",
        "text": "What to skip"
      },
      {
        "type": "ul",
        "items": [
          "Kubernetes. Docker Compose runs the whole system in one file you can read out loud. A Helm chart demonstrates deployment tooling, not distributed systems, and that is not what you are being marked on.",
          "A service mesh. Istio solves a problem you do not have and adds a control plane you will spend a week debugging.",
          "Custom or dedicated service discovery. With Kafka, services do not call each other by address; only the gateway needs to reach them, and in Docker Compose that is a service name in a YAML file. Eureka is in these projects because the tutorial had it.",
          "A config server. Environment variables in a Compose file are fine and you can explain them in one sentence.",
          "Event sourcing plus CQRS on top of everything else. Pick one hard thing and do it properly. Two hard things done badly is worse than one done well.",
          "More than three or four services. Each extra service is more YAML and no additional insight."
        ]
      },
      {
        "type": "h2",
        "text": "Demo failure and recovery, not the happy path"
      },
      {
        "type": "ol",
        "items": [
          "Place two concurrent orders for the last unit in stock. One saga completes, one compensates, and the wallet balance is correct at the end. That is the pessimistic lock and the saga doing their jobs at the same time.",
          "Set the outbox poller interval to five seconds for the rehearsal, place an order, and run docker kill payment-service after the debit commits but before the poller runs. Show the wallet debited, the payment row written, the outbox row with sent_at NULL, and the saga still in AWAITING_PAYMENT, because payment.completed was never published. Restart the container: the poller flushes the row, the saga advances, the order confirms. That is the outbox earning its place, and without it that debit is lost forever.",
          "Re-publish an order.created event by hand with an event id you have already used. Show markProcessed returning 0, the skip in the log, and the balance not moving. At-least-once delivery survived rather than avoided.",
          "Publish an event with a null SKU. Show three retries, the record landing in stock.reserve.DLT with the exception in the headers, the next valid record still being processed, and then the saga for that order turning up as STALLED on your admin page after five sweeps. Point out that with Spring's default handler that record would have been logged once and dropped.",
          "Open Zipkin and show one trace, with spans across all three services, for the order you just placed."
        ]
      },
      {
        "type": "h2",
        "text": "Scope this to the weeks you actually have"
      },
      {
        "type": "p",
        "text": "Two weeks for three services with Kafka wired up and one happy-path saga. One week for idempotency, the dedupe table and the outbox. One week for compensation, the payment.failed path and the sweeper. One week for the dead-letter topic, tracing and the admin page. One week for tests, in particular a Testcontainers integration test that kills a container mid-saga so your recovery claim is verified rather than asserted. That is six weeks of real work and a defensible project. The version with Kubernetes and eight services is ten weeks and a worse story."
      },
      {
        "type": "p",
        "text": "If you want a second pair of eyes on the design before you commit six weeks to it, that is the kind of review we offer at Tenzok. The design above is yours to build without us, and it holds up on its own."
      }
    ],
    "faq": [
      {
        "q": "Is a Spring Boot microservices project a good final year project?",
        "a": "Only if the project is genuinely about distributed systems. Microservices solve an organisational problem (many teams deploying independently) that a student team does not have. If your real contribution is elsewhere, build a modular monolith and defend that choice in the viva. If you do choose microservices, the project has to demonstrate asynchronous messaging, idempotent consumers, a transactional outbox, a saga with working compensation, a dead-letter topic and distributed tracing. Without those it is three CRUD apps in Docker."
      },
      {
        "q": "How do I make a Kafka consumer idempotent in Spring Boot?",
        "a": "Give every event a UUID when it is published. In the consumer, insert that UUID into a processed_event table keyed on (event_id, consumer) and run that insert in the same @Transactional method as the business write. On Postgres use INSERT ... ON CONFLICT DO NOTHING; on MySQL, INSERT IGNORE. If the insert affects zero rows the record is a redelivery, so you return. Returning early is only safe if the events you would have published are written to an outbox table in that same transaction, otherwise a duplicate delivery silently swallows an event you never managed to send."
      },
      {
        "q": "What is the saga pattern and why do I need it in a microservices project?",
        "a": "A saga is a sequence of local database transactions across services, each paired with a compensating transaction that semantically undoes it. You need it because there is no rollback across three separate databases: a debited wallet is not un-debited by a ROLLBACK, it is refunded by a second forward transaction. Use an orchestrator with a state machine persisted in a table, lock the saga row when you transition it, and handle every failure branch, including the payment simply being declined."
      },
      {
        "q": "What does Spring Boot do with a Kafka message that keeps failing?",
        "a": "By default, DefaultErrorHandler retries the record ten times with no backoff (FixedBackOff(0, 9)), then the default recoverer logs it at ERROR, the container commits the offset and moves on. The partition is not blocked, but the record is gone and only a log line remembers it. Configure a DeadLetterPublishingRecoverer so the failed record is republished to a .DLT topic with the exception in the headers, and create the DLT with the same partition count as the source topic."
      },
      {
        "q": "What happens if a service crashes in the middle of a saga?",
        "a": "Nothing is lost if the saga state is persisted before any command is published and every event leaves through an outbox table. The saga simply waits. The window in which balances are inconsistent is bounded by how fast your sweeper reclaims stuck sagas, so set that interval deliberately and be able to state it: a thirty second step timeout, a sweeper every ten seconds, and after five re-drives the saga is marked STALLED for a human. Re-drives must republish the original command under its original event id, or your own retry will defeat your own dedupe table."
      }
    ]
  }
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((post) => post.slug === slug);
}

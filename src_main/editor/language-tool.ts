import { submitLanguage } from "../data/scraping/submitlang";
import { languagetype } from "../file/extension";
import { store } from "../save/save";

export function getDefaultLanguageinfo(
  languageid: languagetype | string
): submitLanguage {
  if (languageid === "cpp") {
    const saveState = store.get(`defaultSubmitLanguage.${languageid}`, {
      LanguageId: "4003",
      Languagename: "C++ (GCC 9.2.1)",
    });
    return saveState;
  } else if (languageid === "python") {
    const saveState = store.get(`defaultSubmitLanguage.${languageid}`, {
      LanguageId: "4006",
      Languagename: "Python (3.8.2)",
    });
    return saveState;
  } else if (languageid === "rust") {
    const saveState = store.get(`defaultSubmitLanguage.${languageid}`, {
      LanguageId: "4050",
      Languagename: "Rust (1.42.0)",
    });
    return saveState;
  } else {
    const saveState = store.get(`defaultSubmitLanguage.${languageid}`, {
      LanguageId: "4003",
      Languagename: "C++ (GCC 9.2.1)",
    });
    return saveState;
  }
}

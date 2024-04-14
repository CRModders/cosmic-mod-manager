# Contributing to site translations

## Adding a new language

- A new folder must be used for a new language
- Each regional locale of a language must be in its own file
- Naming conventions
    - The folder must be named after the two letter code of that language in lower case
    - Each file of a variant of a language must be named after the code of that locale. First, the two letter language code in lower case then a dash and then region code in uppercase.
- There should be a file named `index.ts` in each language folder that exports all the variants of the language.
- British english (en-GB) is the default language of the website. Any template should be copied from here
- Example, adding Australian English in the English variants
    ```text
    // Add a new file "en-AU.ts", (en-AU is the language code of australian english)

    public/
    └── locales/
        └── en/
            ├── en-GB.ts
            ├── en-AU.ts
            └── index.ts
    ```

    ```typescript
    // public/locales/en/en-AU.ts

    import { locale_content_type, locale_meta } from "@/public/locales/interface";


    export const en_au = {
        meta: {
		    language: {
		    	en_name: "English",
		    	locale_name: "English",
		    	code: "en",
		    },
		    region: {
		    	name: "Australia",
		    	short_name: "AU",
		    	code: "AU",
		    },
	    },
        content: {
            // Copy the content from the default locale which is "public/locale/en/en-GB.ts", and use that as a template to replace the english values with their translation
        }
    } satisfies {
        meta: locale_meta;
        content: locale_content_type;
    };
    ```
    
    ```typescript
    // public/locales/en/index.ts

    // This is the default locale, don't modify this file
    import { en_gb } from "./en-GB";

    // Import the language variant you added
    import { en_au } from "./en-AU";

    // Add that language variant to the language object
    const en = {
	    default: en_gb,
	    "en-GB": en_gb,
	    "en-AU": en_au,
    };

    // Default export the object
    export default en;

    ```
- If you added a new language, you must add that language here also
    

    ```typescript
    // public/locales/index.ts

    // Import the language object from the folder's index.ts
    import en from "./en";
    import es from "./es";

    // Add that to this object with that language's code in lowercase as key
    const locales = {
    	default: en.default,
    	en: en,
    	es: es,
    };

    export default locales;


    ```
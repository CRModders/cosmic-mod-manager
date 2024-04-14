# Contributing to the website translation

## Conventions
- The folder of a language must be named after the two letter code of that language in lowercase.
- The locale file must be named in this way -> `the two letter language code in lowercase` then a dash (`-`) and then the `two letter code of the region in UPPERCASE`.<br> That must be a typescript file (file extension `.ts`).
- Anything wrapped in square brackets (`[]`), must remain wrapped in the brackets in the translated version also.
- The `${0}`s present in the strings should be moved according to the translation, as the `${0}` will be replaced by some dynamic value on the website

## Adding a new language
- This example will show you how to add a new language, for this example i will be showing how to add Spanish (`es-ES` is the language code of that spanish locale).
1.  Start by creating a folder for the language inside the `public/locales/` folder. I will make a folder named `es` inside that folder as per the conventions.
2. Create a file for the locale of the language in the folder just created. I will create a typescript file named `es-ES.ts` inside `public/locales/es/` as per conventions.
3. Create a file named `index.ts` inside that same folder.<br>
    Your folder structure should look like this:<br>
    ```
    public/
    └── locales/
        └── es/
            ├── es-ES.ts
            └── index.ts
    ```

4. Open the locale file. `es-ES.ts` file in the current example and add paste the locale file template (You can find the templates in the bottom part of this file). Replace the placeholders with appropriate values.

    ```typescript
    import { locale_content_type, locale_meta } from "@/public/locales/interface";

    export const es_es = {
        meta: {
            language: {
                code: "es",  // Language code of spanish
                en_name: "Spanish",  // English name of spanish
                locale_name: "Español",  // Spanish written in spanish
            },
            region: {
                code: "ES", // Region code of Spain
                name: "Spain",  // Region name
                display_name: "España",  // Display name (Spain), written in spanish
            },
        } satisfies locale_meta,

    	content: {
            // The translated content
    	} satisfies locale_content_type,
    };

    ```

5. Open the file `index.ts` of your new language folder. For this example, `index.ts` of `public/locales/es/` folder. Paste the `index.ts` template and replace the placeholders with actual values.
    ```typescript
    // Replaced "lang_code" with "es_es" and "./lang-CODE" with "./es-ES"
    import { es_es } from "./es-ES";
    
    // Replaced "base_lang_code" with "es"
    const es = {
        // Add the default locale and the locales itself, In this example we have added only one locale so i will add only that locale
        // The default locale is the locale that is most used locale of that language, like british english could be the default in English
    	default: es_es,
    	"es-ES": es_es,
    };

    // Export the language object
    export default es;
    ```
6. Open the file `public/locales/index.ts`, it does not need to be created, it will already be there. Add your new language to the languages list.
    ```typescript
    // Pre-existing imports
    import en from "./en";
    // Import the new language object
    import es from "./es";
    

    const locales = {
    	default: en.default,
    	en: en,
        // Add the new object here, the key should the base language code in lowercase
    	es: es,
    };

    export default locales;
    ```
    ### You've successfully expanded our website's accessibility by adding Spanish to our supported languages!

<br>

## Adding a new locale in already existing language
- Almost everything remains the same.
- Skip the steps `1`, `3` and `6` of Adding a new language.
- On the step `5`, instead of pasting the template again, you would just import the new locale and add the locale in the language object.<br>
  That's it, a new locale has been added.


<br>

## Templates
-  NOTE: Remove the comments from the templates before opening a Pull request

- Locale file template
    ```typescript
    import { locale_content_type, locale_meta } from "@/public/locales/interface";

    // Replace "lang_code" with the actual language code in lowercase. (Example: es_es for Spanish (es-ES))
    export const lang_code = {
    	meta: {
    		language: {
    			code: "BASE_LANGUAGE_CODE",  // Two letter code of that base language (lowercase)
    			en_name: "ENGLISH_NAME",  // English name of the language (Normal case)
    			locale_name: "LOCALE_NAME",  // Name of the language in that language (Normal writing)
    		},
    		region: {
                // Two letter code of that region (UPPERCASE)
    			code: "REGION_CODE",

                // Name of the region in its own language (Normal writing)
    			name: "REGION_NAME",

                // Any shorter name of the region if exists, else it will be same as region code,
                // If the region code is not convincing enough to represent that region, then use then full name or some other shorter name that most people know about
                // For example, region code of United kingdom is "GB" but many people won't understand that it means "UK", so instead of writing "GB" in the short name, use "UK"
                // Another example, the region code of Spain is "ES" but people might not understand, so instead of writing "ES" in the display name,
                // use "España" ("Spain" in Spanish because region's display name must be in its own language)
                // ->  UPPERCASE
    			display_name: "DISPLAY_NAME",
    		},
    	} satisfies locale_meta,

    	content: {

            // Copy the content from the default locale, which is British english ("public/locales/en/en-GB.ts")
            // Replace the english string values with their translated versions

    	} satisfies locale_content_type,
    };

    ```

- Template of the file `index.ts` of a language folder

    ```typescript
    // Import the locale
    // lang_code :=> Full language code in lowercase with the dash (-) replaced with an underscore (_)
    // lang-CODE :=> Full language code with the first part in lowercase then a dash (-) and then the other part of code in UPPERCASE
    import { lang_code } from "./lang-CODE";

    // base_lang_code :=> Base language code of the language in lowercase
    const base_lang_code = {
    	default: lang_code,
    	"lang-CODE": lang_code,
    };

    // Export the language object
    export default base_lang_code;

    ```

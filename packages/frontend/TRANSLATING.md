## Adding your language

1. Open [app/locales/meta.ts](/packages//frontend/app/locales/meta.ts) and add the metadata for the language you are adding.

    ```ts
        const SupportedLocales = [
            meta({
                code: "en",
                name: "English",
                nativeName: "English",
                dir: "ltr",
            }),
        
            // Example
    +       meta({
    +           code: "es", // ISO-639 code of the language
    +           name: "Spanish",
    +           nativeName: "Español",
    +           dir: "ltr",
    +           region: {
    +               code: "ES",
    +               name: "Spain",
    +               displayName: "España",
    +           },
    +       }),
    +   ];
    ```

> [!NOTE]
> Only add the `region` field if you are adding a regional variant of a language, otherwise you can omit that field.


2. Create the language folder in `/packages/frontend/app/locales` directory. \
The name of the folder should be 
`LANG_CODE-REGION_CODE` (eg: `es-ES`). \
If your lang's metadata doesn't have region field then just `LANG_CODE` (eg: `en`).

3. Create a file named `tags.ts` in the folder you just created and paste the following: \
    You can reference the [`en/tags.ts`](/packages/frontend/app/locales/en/tags.ts) file for the keys.
    ```ts
    import type tags from "~/locales/en/tags";

    export default { } satisfies typeof tags;
    ```

4. Now create a file named `legal.ts` with the following contents:
    Reference - [`en/legal.ts`](/packages/frontend/app/locales/en/legal.ts)
    ```ts
    import type { RulesProps } from "~/locales/en/legal";

    export function Rules(props: RulesProps) {
        return `
    # ${props.title}
    `;
    }

    ```

5. Create the entry file `translation.ts` in the your folder. \
    Reference - [`en/translation.ts`](/packages/frontend/app/locales/en/translation.ts)
    ```ts
    import type { Locale } from "~/locales/types";
    import { Rules } from "./legal";
    import tags from "./tags";

    export default {
        search: {
            tags: tags
        },

        legal: {
            contentRules: Rules
        }
    } satisfies Locale;
    ```

> [!IMPORTANT]
> If you decide to copy paste an existing lang folder and then edit that with the translation, make sure you don't use the default `en` for that, if you do you'll need to change the `TypeScript` types imported in the files because 
# Adding your translations

1. Open [app/locales/meta.ts](/apps/frontend/app/locales/meta.ts) and add the metadata for the language you are adding.

    ```ts
        const SupportedLocales: LocaleMetaData[] = [
            {
                code: "en",
                name: "English",
                nativeName: "English",
                dir: "ltr",
            },
        
            // Example
    +       {
    +           code: "es", // ISO-639 code of the language
    +           name: "Spanish",
    +           nativeName: "Español",
    +           dir: "ltr",
    +           region: {
    +               code: "ES",
    +               name: "Spain",
    +               displayName: "España",
    +           },
    +       },
    +   ];
    ```

> [!NOTE]
> Add the `region` field only if you are adding a regional variant of a language, otherwise you can omit that field.


2. Create the language folder in `/apps/frontend/app/locales` directory. \
The name of the folder should be `{lang}-{REGION}` (eg: `es-ES`). \
If your lang's metadata doesn't have region field then just `{lang}` (eg: `en`).

3. Create a file named `tags.ts` in the folder you just created and paste the following: \
    You can reference the [`en/tags.ts`](/apps/frontend/app/locales/en/tags.ts) file for the keys.
    ```ts
    import type tags from "~/locales/en/tags";

    export default { } satisfies typeof tags;
    ```

4. Now create a file named `legal.ts` with the following contents:
    Reference - [`en/legal.ts`](/apps/frontend/app/locales/en/rules.ts)
    ```ts
    import type { RulesProps } from "~/locales/en/legal";

    export function Rules(props: RulesProps) {
        return `
    # ${props.title}
    `;
    }

    ```

5. Create the entry file `translation.ts` in the your folder. \
    Reference - [`en/translation.ts`](/apps/frontend/app/locales/en/translation.ts)
    ```ts
    import type { Locale } from "~/locales/types";
    import { SearchItemHeader_Keys } from "../shared-enums";
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

:::info
If you decide to copy paste an existing lang folder and then edit that with the translation, make sure you don't use the default `en` for that, if you do you'll need to change the `TypeScript` types imported in the files. \
I'd recommend you to use a code editor that supports typescript because there are types available for all the translation keys so your editor will let you know when something doesn't match the expected type.
:::


### A really helpful tip for those who will be using VS Code for this

_NOTE: This doesn't work in vscode web version. You can use GitHub codespace if you don't have it installed._

If you don't wanna search for every missing key manually in the base translation when updating your translation files your editor can lend you a hand. Put your cursor inside the translation object and press `Ctrl` + `Space`, it'll pop open a list of suggestions that includes all the keys that are missing from that object.
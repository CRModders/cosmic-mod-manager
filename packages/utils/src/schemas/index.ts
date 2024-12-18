import { z } from "zod";
import type { newProjectFormSchema } from "./project";

export { z };

type schema = z.infer<typeof newProjectFormSchema>;

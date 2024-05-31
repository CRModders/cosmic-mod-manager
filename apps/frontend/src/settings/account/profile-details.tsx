import { EditIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { AuthProviderData } from "@/types";
import type { AuthProviderType, LocalUserSession } from "@root/types";
import { useState } from "react";

type Props = {
	name: string;
	username: string;
	linkedProviders: AuthProviderData[];
	setNewSession: (newSession: Partial<LocalUserSession>) => void;
	currProfileProvider: AuthProviderType | undefined;
};

const EditProfileDialog = ({ name, username, linkedProviders, setNewSession, currProfileProvider }: Props) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="flex gap-2 items-center justify-center" variant="outline" aria-label="Edit profile">
					<EditIcon size="1rem" className="text-foreground-muted" />
					<p className="pr-1">Edit</p>
				</Button>
			</DialogTrigger>

			<div className="w-full flex flex-col items-center justify-center py-4">
				<EditProfileInfoForm
					name={name}
					username={username}
					linkedProviders={linkedProviders}
					currProfileProvider={currProfileProvider}
					setNewSession={setNewSession}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
				/>
			</div>
		</Dialog>
	);
};

export default EditProfileDialog;

// import { updateUserProfile } from "@/app/api/actions/user";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { maxNameLength, maxUsernameLength } from "@root/config";
import { isValidName, isValidUsername, parseProfileProvider } from "@root/lib/user";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditFormProps = {
	name: string;
	username: string;
	linkedProviders: AuthProviderData[];
	currProfileProvider: AuthProviderType | undefined;
	setNewSession: (newSession: Partial<LocalUserSession>) => void;
	dialogOpen?: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProfileInfoForm = ({
	name,
	username,
	linkedProviders,
	currProfileProvider,
	setNewSession,
	setDialogOpen,
}: EditFormProps) => {
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const { toast } = useToast();

	const formSchema = z.object({
		currProfileProvider: z.string(),
		username: z
			.string()
			.min(1, {
				message: "Enter your username",
			})
			.max(maxUsernameLength, {
				message: `Your username can only have a maximum of ${maxUsernameLength} characters`,
			}),
		name: z
			.string()
			.min(2, {
				message: "Enter your name",
			})
			.max(maxNameLength, {
				message: `Your name can only have a maximum of ${maxNameLength} characters`,
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currProfileProvider: currProfileProvider,
			username: username || "",
			name: name || "",
		},
	});

	const checkFormError = () => {
		const name = form.getValues("name");
		const username = form.getValues("username");

		if (!username && !name) return setFormError(null);

		if (isValidUsername(username) !== true) {
			const error = isValidUsername(username);
			if (username) {
				return setFormError(error.toString());
			}
		}

		if (isValidName(name) !== true) {
			const error = isValidName(name);
			if (name) {
				return setFormError(error.toString());
			}
		}

		setFormError(null);
	};

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (loading) return;

		checkFormError();
		// Just a hack to get the updated value from the state
		let err: string | null = null;
		setFormError((error) => {
			err = error;
			return error;
		});

		if (err) {
			return;
		}

		const providerName = parseProfileProvider(values.currProfileProvider);
		if (!providerName) return;

		setFormError(null);
		setLoading(true);

		const response = await useFetch("/api/user/edit-profile", {
			method: "POST",
			body: JSON.stringify({
				user_name: values.username,
				name: values.name,
				avatar_provider: providerName,
			}),
		});

		const result = await response.json();
		setLoading(false);

		if (result?.success === true) {
			toast({
				title: result?.message,
			});

			if (result?.updatedData) {
				setNewSession(result?.updatedData as Partial<LocalUserSession>);
			}
			setDialogOpen(false);
		} else if (result?.success === false) {
			setFormError(result?.message);
		}
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="font-semibold text-foreground-muted">Edit profile</DialogTitle>
			</DialogHeader>

			<Form {...form}>
				<form
					name="Edit profile"
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full flex flex-col items-center justify-center gap-3"
				>
					<div className="w-full flex flex-col items-center justify-center gap-4">
						<div className="w-full flex flex-col items-center justify-center">
							<FormField
								control={form.control}
								name="currProfileProvider"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
												<span className="text-foreground-muted">Profile image provider</span>
												<FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
											</FormLabel>
											<Select
												onValueChange={(value: string) => {
													field.onChange(value);
												}}
												defaultValue={field.value}
											>
												<FormControl className="capitalize">
													<SelectTrigger>
														<SelectValue placeholder="" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{linkedProviders?.map((provider) => {
														return (
															<SelectItem key={provider.provider} value={provider.provider} className="capitalize">
																{provider.provider}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</FormItem>
									</>
								)}
							/>
						</div>

						<div className="w-full flex flex-col items-center justify-center">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
												<span className="text-foreground-muted">Username</span>
												<FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="john_doe"
													className="w-full flex items-center justify-centerp"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
														field.onChange(e);
														checkFormError();
													}}
												/>
											</FormControl>
										</FormItem>
									</>
								)}
							/>
						</div>

						<div className="w-full flex flex-col items-center justify-center">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<>
										<FormItem className="w-full flex flex-col items-center justify-center space-y-1">
											<FormLabel className="w-full flex items-end justify-between text-left min-h-4 gap-12">
												<span className="text-foreground-muted">Name</span>
												<FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="John Doe"
													className="w-full flex items-center justify-center"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
														field.onChange(e);
														checkFormError();
													}}
												/>
											</FormControl>
										</FormItem>
									</>
								)}
							/>
						</div>
					</div>

					{formError && <FormErrorMessage text={formError} />}

					<DialogFooter className="w-full mt-4">
						<div className="w-full flex items-center justify-end gap-2">
							<DialogClose className="w-fit hover:bg-bg-hover text-foreground-muted rounded-lg" aria-label="Cancel">
								<p className="text-base px-4 h-10 flex items-center justify-center">Cancel</p>
							</DialogClose>

							<Button
								type="submit"
								aria-label="Update profile"
								className="h-10"
								disabled={
									form.getValues().name === name &&
									form.getValues().username === username &&
									form.getValues().currProfileProvider === currProfileProvider
								}
							>
								<p className="px-4">Update profile</p>
							</Button>
						</div>
					</DialogFooter>
				</form>
				{loading === true && (
					<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center">
						<div className="w-full h-full flex items-center justify-center relative rounded-xl">
							<div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background dark:bg-background_dark opacity-60" />
							<Spinner size="1.5rem" />
						</div>
					</div>
				)}
			</Form>
		</DialogContent>
	);
};

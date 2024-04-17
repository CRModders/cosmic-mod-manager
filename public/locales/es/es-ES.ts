import { locale_variant_object } from "@/public/locales/interface";

export const es_es: locale_variant_object = {
	meta: {
		language: {
			en_name: "Spanish",
			locale_name: "Español",
			code: "es",
		},
		region: {
			name: "Spain",
			code: "ES",
			display_name: "España",
		},
	},

	// This temporary ai generated translaton is just for testing
	content: {
		globals: {
			site: {
				full_name: "Cosmic Reach Mod Manager",
				short_name: "CRMM",
			},
			mods: "Mods",
			resource_packs: "Packs de recursos",
			modpacks: "Packs de mods",
			shaders: "Shaders",

			continue: "Continuar",
			confirm: "Confirmar",
			cancel: "Cancelar",
			delete: "Eliminar",
			remove: "Quitar",
			link: "Enlazar",
			messages: {
				something_went_wrong: "Algo salió mal",
				email_sent_successfully: "Correo electrónico enviado exitosamente",
				error_sending_email:
					"Error al enviar correo electrónico de confirmación",
				internal_server_error: "Error interno del servidor",
				invalid_request: "Solicitud inválida",
				invalid_token: "Token inválido",
				expired_token: "Token caducado",
				cancelled_successfully: "Cancelado exitosamente",
			},
		},
		api_responses: {
			user: {
				invalid_form_data: "Datos de formulario inválidos",
				username_not_available:
					"Ese nombre de usuario no está disponible, prueba con otro",
				profile_update_success: "Perfil actualizado exitosamente",
				something_went_wrong_try_again:
					"¡Algo salió mal! Por favor, inténtalo de nuevo",
				email_and_pass_required:
					"Correo electrónico y contraseña son requeridos",
				no_account_exists_with_that_email:
					"No existe una cuenta con el correo electrónico proporcionado",
				incorrect_email_or_pass: "Correo electrónico o contraseña incorrectos",
				incorrect_password: "Contraseña incorrecta",
				login_success: "Inicio de sesión exitoso",
				cant_unlink_the_last_auth_provider:
					"No puedes desvincular el único proveedor de autenticación restante",
				successfully_removed_provider: "Proveedor ${0} eliminado exitosamente",
				invalid_password: "Contraseña inválida. ${0}",
				successfully_removed_password: "Contraseña eliminada exitosamente",
				successfully_added_new_password:
					"Nueva contraseña añadida exitosamente",
				password_login_not_enabled:
					"No puedes cambiar la contraseña, no has habilitado el inicio de sesión con contraseña.",
				password_login_not_enabled_desc:
					"Solo las cuentas que tienen una contraseña agregada pueden cambiarla. Si no, puedes usar proveedores de autenticación para iniciar sesión.",
				successfully_deleted_account: "Cuenta eliminada exitosamente",
				cancelled_account_deletion:
					"Eliminación de cuenta cancelada exitosamente",
			},
		},
		auth: {
			dashboard: "Tablero",
			settings: "Ajustes",
			your_profile: "Tu perfil",
			email: "Correo electrónico",
			password: "Contraseña",
			sign_up: "Registrarse",
			login: "Iniciar sesión",
			sign_out: "Cerrar sesión",
			invalid_session_msg: "Sesión local inválida",
			signing_out: "Cerrando sesión",
			something_went_wrong: "Algo salió mal",

			login_page: {
				meta_desc:
					"Inicia sesión en el administrador de mods de Cosmic Reach para obtener una experiencia más personalizada.",
				dont_have_an_account: "¿No tienes una cuenta?",
				forgot_password_msg: "¿No recuerdas tu contraseña?",
				log_in_using: "Iniciar sesión usando:",
				invalid_email_msg:
					"Introduce una dirección de correo electrónico válida",
				invalid_password_msg: "Introduce una contraseña válida",
			},
			singup_page: {
				meta_desc:
					"Regístrate para obtener una cuenta y tener acceso a subir contenido en Cosmic Reach mod manager",
				signup_using_providers:
					"Regístrate usando cualquiera de los proveedores de autenticación",
				already_have_an_account: "¿Ya tienes una cuenta?",
			},
			change_password_page: {
				change_password: "Cambiar contraseña",
				meta_desc: "Restablece la contraseña de tu cuenta de CRMM.",
				email_sent_desc:
					"Abre el enlace enviado a tu correo electrónico y cambia tu contraseña.",
			},
			action_verification_page: {
				invalid_token: "Token caducado o inválido",
				didnt_request_email: "¿No solicitaste el correo electrónico?",
				check_sessions: "Verificar sesiones iniciadas",
				verify_new_password: "Verifica tu nueva contraseña",
				add_new_password_desc:
					"Recientemente se agregó una nueva contraseña a tu cuenta. Confirma abajo si fuiste tú. La nueva contraseña no funcionará hasta entonces.",
				delete_account: "Eliminar tu cuenta",
				delete_account_desc:
					"Eliminar tu cuenta eliminará todos tus datos excepto tus proyectos de nuestra base de datos. No hay vuelta atrás después de eliminar tu cuenta.",
				enter_password: "Ingresa tu nueva contraseña",
				re_enter_password: "Vuelve a ingresar tu contraseña",
				max_password_length_msg:
					"Tu contraseña solo puede tener un máximo de ${0} caracteres",
				password_dont_match: "Las contraseñas no coinciden",
				cancelled_successfully: "Cancelado exitosamente",
				password_changed: "Contraseña cambiada exitosamente",
				new_password: "Nueva contraseña",
				confirm_new_password: "Confirmar nueva contraseña",
			},
		},
		home_page: {
			hero: {
				description: {
					line_1: "El mejor lugar para tus mods de [Cosmic Reach].",
					line_2: "Descubre, juega y crea contenido, todo en un solo lugar.",
				},
				explore_mods: "Explorar mods",
			},
			featured_section: {
				popular_mods: "Mods populares",
				popular_resource_packs: "Packs de recursos populares",
			},
		},
		user_profile_page: {
			meta_desc: "Perfil de ${0} en CRMM",
		},

		settings_page: {
			meta_desc: "Ajustes de cuenta",
			account_section: {
				meta_title: "Ajustes de cuenta",
				account: "Cuenta",
				user_profile: "Perfil de usuario",
				edit: "Editar",
				edit_profile: "Editar perfil",
				enter_username: "Ingresa tu nombre de usuario",
				enter_name: "Ingresa tu nombre",
				username_max_chars_limit:
					"Tu nombre de usuario solo puede tener un máximo de ${0} caracteres",
				name_max_chars_limit:
					"Tu nombre solo puede tener un máximo de ${0} caracteres",
				pfp_provider: "Proveedor de imagen de perfil",
				username: "Nombre de usuario",
				full_name: "Nombre completo",
				save_profile: "Guardar perfil",
				account_security: "Seguridad de la cuenta",
				add_a_password_msg:
					"Agrega una contraseña para usar el inicio de sesión con credenciales",
				change_account_password: "Cambiar contraseña de tu cuenta",
				add_password: "Agregar contraseña",
				remove_password: "Eliminar contraseña",
				enter_your_password: "Ingresa tu contraseña",
				remove_account_password: "Eliminar la contraseña de tu cuenta",
				manage_auth_providers: "Administrar proveedores de autenticación",
				manage_auth_providers_desc:
					"Agrega o elimina métodos de inicio de sesión de tu cuenta.",
				manage_providers_label: "Administrar proveedores",
				provider_email_tooltip:
					"El correo electrónico de la cuenta ${0} vinculada",
				auth_providers_label: "Proveedores de autenticación",
				link_a_provier: "Vincular proveedor ${0}",
				delete_account: "Eliminar cuenta",
				deletion_email_sent_desc:
					"Se ha enviado un correo electrónico de confirmación a tu dirección de correo electrónico. Confirma allí para eliminar tu cuenta.",
				account_deletion_desc:
					"Una vez que elimines tu cuenta, no hay vuelta atrás. Eliminar tu cuenta eliminará todos tus datos, excepto tus proyectos, de nuestros servidores.",
				confirm_to_delete_account:
					"¿Estás seguro de que quieres eliminar tu cuenta?",
			},
			sessions_section: {
				sessions: "Sesiones",
				meta_desc: "Administrar sesiones iniciadas",
				view_page: "Ver pagina",
				sensitive_info_warning: "Advertencia: información confidencial",
				session_page_warning_message:
					"Esta página contiene información confidencial como su dirección IP y ubicación. Asegúrate de no enviar capturas de pantalla, grabaciones o información de esta página a personas que no deseas que tengan esta información.",
				page_desc: {
					line_1:
						"Aquí están todos los dispositivos que están actualmente conectados con tu cuenta. Puedes cerrar sesión en cada uno individualmente.",
					line_2:
						"Si ves una entrada que no reconoces, cierra la sesión en ese dispositivo y cambia la contraseña de la cuenta que se usó para crear esa sesión.",
				},
				current_session: "Sesión actual",
				timestamp_template:
					"${month} ${day}, ${year} a las ${hours}:${minutes} ${amPm}",
				last_used: "Último uso",
				created: "Creado",
				time_past_phrases: {
					just_now: "justo ahora",
					minute_ago: "hace ${0} minuto",
					minutes_ago: "hace ${0} minutos",
					hour_ago: "hace ${0} hora",
					hours_ago: "hace ${0} horas",
					day_ago: "hace ${0} día",
					days_ago: "hace ${0} días",
					week_ago: "hace ${0} semana",
					weeks_ago: "hace ${0} semanas",
					month_ago: "hace ${0} mes",
					months_ago: "hace ${0} meses",
					year_ago: "hace ${0} año",
					years_ago: "hace ${0} años",
				},
				session_created_using_provider:
					"Esta sesión se creó utilizando el proveedor ${0}",
				revoke_session: "Revocar sesión",
			},
		},

		footer: {
			site_desc:
				"Una solución integral para el contenido de Cosmic Reach. Mods, shaders, packs de recursos, packs de mods y más",
			socials: "Redes sociales",
			explore: "Explorar",
			privacy_policy: "Política de privacidad",
			terms: "Términos",
			change_theme: "Cambiar tema",
		},
	},
};

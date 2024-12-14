export interface RulesProps {
    title: string;
    supportEmail: string;
    privacyPageUrl: string;
    termsPageUrl: string;
}

export function Rules(props: RulesProps) {
    return `
# ${props.title}

Si encuentras alguna forma de violación de estas Normas en nuestro sitio web, te pedimos que nos lo hagas saber. Puedes utilizar el botón "Reportar" en cualquier página de proyecto, versión o usuario, o puedes enviarnos un correo electrónico a [${props.supportEmail}](mailto:${props.supportEmail}).

## 1. Contenido prohibido

El contenido debe cumplir en su totalidad con todas las leyes y regulaciones federales, estatales, locales e internacionales aplicables. Sin limitar lo anterior, el Contenido no debe:

1. Contener material difamatorio, obsceno, indecente, abusivo, ofensivo, acosador, violento, odioso, inflamatorio, dañino, perjudicial, perturbador, contradictorio u objetable.
2. Promover material sexualmente explícito o pornográfico, violencia o discriminación basada en raza, sexo, género, religión, nacionalidad, discapacidad, orientación sexual o edad.
3. Infringir cualquier patente, marca registrada, secreto comercial, derecho de autor u otros derechos de propiedad intelectual u otros derechos de cualquier otra persona.
4. Violar los derechos legales (incluidos los derechos de publicidad y privacidad) de otros o contener cualquier material que pueda dar lugar a cualquier responsabilidad civil o penal bajo las leyes o regulaciones aplicables o que de otro modo pueda estar en conflicto con nuestros [Términos de uso](${props.termsPageUrl}) o [Política de privacidad](${props.privacyPageUrl}).
5. Promover cualquier actividad ilegal o abogar, promover o ayudar a cualquier acto ilegal, incluidas las drogas de la vida real o sustancias ilícitas.
6. Causar ansiedad innecesaria o ser probable que moleste, avergüence, alarme, dañe o engañe a cualquier otra persona.
7. Suplantar a cualquier persona o tergiversar su identidad o afiliación con cualquier persona u organización.
8. Dar la impresión de que emanan de o están respaldados por nosotros o cualquier otra persona o entidad, si este no es el caso.
9. Cargar cualquier dato a un servidor remoto sin una clara divulgación en el juego.

## 2. Función clara y honesta

Los proyectos, una forma de Contenido, deben hacer un intento claro y honesto de describir su propósito en las áreas designadas de la página del proyecto. La información necesaria no debe ocultarse de ninguna manera. El uso de lenguaje confuso o jerga técnica cuando no es necesario constituye una violación.

### 2.1. Expectativas generales

A partir de la descripción de un proyecto, los usuarios deben poder entender qué hace el proyecto y cómo usarlo. Los proyectos deben intentar describir las siguientes tres cosas dentro de su descripción:

a. Lo que el proyecto hace o agrega específicamente
b. Por qué alguien debería querer descargar el proyecto
c. Cualquier otra información crítica que el usuario debe saber antes de descargar

### 2.2. Accesibilidad

Las descripciones de los proyectos deben ser accesibles para que puedan leerse a través de una variedad de medios. Todas las descripciones deben tener una versión de texto sin formato, aunque las imágenes, videos y otro contenido pueden tener prioridad si se desea. Los encabezados no deben usarse para el texto del cuerpo.

Las descripciones de los proyectos deben tener una traducción al inglés a menos que estén exclusivamente destinadas a usarse en un idioma específico, como los paquetes de traducción. Las descripciones pueden proporcionar traducciones a otros idiomas si se desea.

## 3. Trucos y hacks

Los proyectos no pueden contener o descargar "trucos", que definimos como una modificación del lado del cliente que:

1. Se anuncia como un "truco", "hack" o "cliente hackeado".
2. Contiene cualquiera de las siguientes funciones sin requerir un opt-in del lado del servidor:
    a. Ocultación activa del lado del cliente de modificaciones de terceros que tienen opciones de exclusión del lado del servidor
    b. Envío innecesario de paquetes a un servidor
    c. Dañar a otros dispositivos de usuario

## 4. Derechos de autor y re-subidas

Debes ser propietario o tener las licencias, derechos, consentimientos y permisos necesarios para almacenar, compartir y distribuir el Contenido que se carga bajo tu cuenta de CRMM.

El contenido no puede volver a cargarse directamente desde otra fuente sin el permiso explícito del autor original. Si se ha otorgado un permiso explícito o es un "fork" que cumple con la licencia, esta restricción no se aplica.

## 5. Miscelánea

Hay ciertos otros aspectos pequeños para crear proyectos que todos los autores deben intentar cumplir. Estos no siempre se harán cumplir necesariamente, pero cumplir con todos ellos dará como resultado una revisión más rápida con menos problemas potenciales.

1. Todos los metadatos, incluida la licencia, la información del lado del cliente/servidor, las etiquetas, etc., se completan correctamente y son consistentes con la información encontrada en otros lugares.
2. Los títulos de los proyectos son solo el nombre del proyecto, sin ningún otro dato de relleno innecesario.
3. Los resúmenes de los proyectos contienen un pequeño resumen del proyecto sin ningún formato y sin repetir el título del proyecto.
4. Todos los enlaces externos conducen a recursos públicos que son relevantes.
5. Las imágenes de la galería son relevantes para el proyecto y cada una contiene un título.
6. Todas las dependencias deben especificarse en la sección Dependencias de cada versión.
7. Los "archivos adicionales" solo se utilizan para fines especiales designados, como los archivos JAR fuente. En otras palabras, se utilizan versiones y/o proyectos separados cuando corresponde en lugar de archivos adicionales.
`;
}

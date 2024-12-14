import type { RulesProps } from "../en/legal";

export function Rules(props: RulesProps) {
    return `
# ${props.title}

Si encuentras algún tipo de violación de estas Reglas en nuestro sitio web, te pedimos que nos lo hagas saber. Puedes usar el botón Informar en cualquier proyecto, versión o página de usuario, o puedes enviarnos un correo electrónico a [${props.supportEmail}](mailto:${props.supportEmail}).

## 1. Contenido prohibido

El contenido debe cumplir en su totalidad con todas las leyes y regulaciones federales, estatales, locales e internacionales aplicables. Sin limitar lo anterior, el contenido no debe:

1. Contener ningún material que sea difamatorio, obsceno, indecente, abusivo, ofensivo, acosador, violento, odioso, provocador, dañino, perjudicial, disruptivo, contradictorio o de otro modo objetable.
2. Promocionar material sexualmente explícito o pornográfico, violencia o discriminación basada en raza, sexo, género, religión, nacionalidad, discapacidad, orientación sexual o edad.
3. Infringir cualquier patente, marca registrada, secreto comercial, derecho de autor u otra propiedad intelectual u otros derechos de cualquier otra persona.
4. Violar los derechos legales (incluidos los derechos de publicidad y privacidad) de otros o contener cualquier material que pueda dar lugar a cualquier responsabilidad civil o penal según las leyes o regulaciones aplicables o que de otro modo pueda estar en conflicto con nuestros [Términos de uso](${props.termsPageUrl}) o [Política de privacidad](${props.privacyPageUrl}).
5. Promocionar cualquier actividad ilegal, o defender, promover o ayudar a cualquier acto ilegal, incluidas las drogas reales o sustancias ilícitas.
6. Causar ansiedad innecesaria o ser susceptible de molestar, avergonzar, alarmar, dañar o engañar a cualquier otra persona.
7. Suplantar a cualquier persona o tergiversar su identidad o afiliación con cualquier persona u organización.
8. Dar la impresión de que emanan de nosotros o de cualquier otra persona o entidad, o que están respaldados por nosotros, si este no es el caso.
9. Subir datos a un servidor remoto sin una divulgación clara en el juego.

## 2. Función clara y honesta

Los proyectos, una forma de contenido, deben hacer un intento claro y honesto de describir su propósito en áreas designadas en la página del proyecto. La información necesaria no debe ocultarse de ninguna manera. El uso de lenguaje confuso o jerga técnica cuando no es necesario constituye una infracción.

### 2.1. Expectativas generales

A partir de una descripción del proyecto, los usuarios deben poder comprender qué hace el proyecto y cómo usarlo. Los proyectos deben intentar describir las siguientes tres cosas dentro de su descripción:

a. Qué hace o agrega específicamente el proyecto

b. Por qué alguien querría descargar el proyecto

c. Cualquier otra información crítica que el usuario debe saber antes de descargar

### 2.2. Accesibilidad

Las descripciones de los proyectos deben ser accesibles para que puedan leerse a través de una variedad de medios. Todas las descripciones deben tener una versión de texto simple, aunque las imágenes, los videos y otro contenido pueden tener prioridad si se desea. No se deben utilizar encabezados para el cuerpo del texto.

Las descripciones de los proyectos deben tener una traducción al inglés, a menos que estén destinadas exclusivamente para su uso en un idioma específico, como los paquetes de traducción. Las descripciones pueden proporcionar traducciones a otros idiomas si así se desea.

## 3. Trucos y hacks

Los proyectos no pueden contener ni descargar "trucos", que definimos como una modificación del lado del cliente que:

1. Se publicite como un "truco", un "hack" o un "cliente hackeado".
2. Contenga cualquiera de las siguientes funciones sin requerir una aceptación del lado del servidor:
a. Ocultación activa del lado del cliente de modificaciones de terceros que tengan opciones de exclusión del lado del servidor
b. Envío innecesario de paquetes a un servidor
c. Daños a los dispositivos de otros usuarios

## 4. Derechos de autor y re-cargas

Debe poseer o tener las licencias, derechos, consentimientos y permisos necesarios para almacenar, compartir y distribuir el Contenido que se carga en su cuenta de CRMM.

No se puede volver a cargar contenido directamente desde otra fuente sin el permiso explícito del autor original. Si se ha otorgado el permiso explícito o se trata de una "bifurcación" que cumple con la licencia, esta restricción no se aplica.

## 5. Varios

Existen otros aspectos menores en la creación de proyectos que todos los autores deben intentar respetar. No siempre se harán cumplir necesariamente, pero cumplir con todos dará como resultado una revisión más rápida con menos problemas potenciales.

1. Todos los metadatos, incluida la licencia, la información del lado del cliente/servidor, las etiquetas, etc., se completan correctamente y son coherentes con la información que se encuentra en otros lugares.
2. Los títulos de los proyectos son solo el nombre del proyecto, sin ningún otro dato de relleno innecesario.
3. Los resúmenes de los proyectos contienen un pequeño resumen del proyecto sin ningún formato y sin repetir el título del proyecto.
4. Todos los enlaces externos conducen a recursos públicos que son relevantes.
5. Las imágenes de la galería son relevantes para el proyecto y cada una contiene un título.
6. Todas las dependencias deben especificarse en la sección Dependencias de cada versión.
7. Los "archivos adicionales" solo se utilizan para fines especiales, como los archivos JAR de origen. En otras palabras, se utilizan versiones y/o proyectos independientes cuando corresponde en lugar de archivos adicionales.
`;
}

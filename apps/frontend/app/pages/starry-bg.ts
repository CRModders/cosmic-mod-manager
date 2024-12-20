import { MersenneTwister } from "@app/utils/random";
const m = new MersenneTwister();

export default async function main() {
    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    function draw(theme = getTheme(), recreate = false) {
        return new Promise<void>((resolve) => {
            const canvas = document.querySelector("#starry_bg_canvas") as HTMLCanvasElement;
            if (!canvas) return;

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            if (!ctx) return;

            const themeCtx = getThemeColor(theme);
            const width = Math.round(canvas.parentElement?.getBoundingClientRect().width || 0);
            const height = Math.round(canvas.parentElement?.getBoundingClientRect().height || 0);
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            if (recreate) ctx.clearRect(0, 0, width, height);

            const starsCount = Math.round(width / 10);
            const meteorCount = 5;

            const meteorAngle = Math.PI * (10 / 13);

            if (recreate || stars.length === 0) {
                stars = [];
                // Create the stars and meteors
                const baseRadius = themeCtx.theme === "light" ? 3.5 : 3;
                for (let i = 0; i < starsCount; i++) {
                    stars.push(createStar(width, height, baseRadius));
                }
            }

            if (recreate || meteors.length === 0) {
                meteors = [];
                for (let i = 0; i < meteorCount; i++) {
                    meteors.push(createMeteor(width, height, meteorAngle));
                }
            }

            function drawStars() {
                for (const star of stars) {
                    drawStar(ctx, star, themeCtx);
                }
                ctx.fill();
            }

            function drawMeteors() {
                for (const meteor of meteors) {
                    drawMeteor(ctx, meteor, themeCtx);
                }
                ctx.fill();
            }

            drawStars();
            drawMeteors();
            resolve();
            canvas.setAttribute("data-drawn", "true");
        });
    }

    const observer = new MutationObserver(() => draw(undefined, true));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", () => draw(undefined, true));

    // Initial draw
    draw();

    // @ts-ignore
    window.drawStars = draw;
}

interface Vector2D {
    x: number;
    y: number;
}

interface Star {
    position: Vector2D;
    radius: number;
    alpha: number;
}

function createStar(width: number, height: number, baseRadius = 2): Star {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    return {
        position: {
            x: random() * width,
            y: random() * height,
        },
        radius: random() * plusOrMinus + baseRadius,
        alpha: Math.min(1, random() * 0.5 + 0.75),
    };
}

function drawStar(ctx: CanvasRenderingContext2D, star: Star, theme: ThemeColor) {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = theme.bg;
    ctx.roundRect(star.position.x, star.position.y, star.radius, star.radius, 50);

    ctx.globalAlpha = 1;
}

interface Meteor {
    position: Vector2D;
    velocity: Vector2D;
    speed: number;
    length: number;
    width: number;
}

function createMeteor(width: number, height: number, angle: number, baseWidth = 6): Meteor {
    const speed = random() * 2 + 1;
    const length = random() * 25 * speed + 65;

    return {
        position: {
            x: random() * width,
            y: random() * height,
        },
        speed: speed,
        velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        },
        length: length,
        width: random() * 0.01 * length + baseWidth,
    };
}

function drawMeteor(ctx: CanvasRenderingContext2D, meteor: Meteor, theme: ThemeColor) {
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(meteor.position.x, meteor.position.y);

    const endX = meteor.position.x - (meteor.velocity.x * meteor.length) / meteor.speed;
    const endY = meteor.position.y - (meteor.velocity.y * meteor.length) / meteor.speed;
    ctx.lineTo(endX, endY);

    // Gradient for fading tail
    const rgb = theme.bg_rgb.join(", ");
    const linearGradient = ctx.createLinearGradient(meteor.position.x, meteor.position.y, endX, endY);
    {
        const stepSize = 0.1;
        const initialAlpha = 1;
        const k = 1.5;
        let currentAlpha = initialAlpha;
        for (let i = 0; i <= 1; i += stepSize) {
            linearGradient.addColorStop(i, `rgba(${rgb}, ${calculateExponentialAlpha(currentAlpha, k, i)})`);
            currentAlpha = calculateExponentialAlpha(initialAlpha, k, i);
        }
        linearGradient.addColorStop(1, `rgba(${rgb}, 0)`);
    }

    ctx.strokeStyle = linearGradient;
    ctx.lineWidth = meteor.width;
    ctx.lineCap = "round"; // Rounded corners
    ctx.stroke();

    // Add a bright head to the meteor
    const radialGradient = ctx.createRadialGradient(
        meteor.position.x,
        meteor.position.y,
        0,
        meteor.position.x,
        meteor.position.y,
        meteor.length / 2,
    );

    const stepSize = 0.1;
    const initialAlpha = 0.6;
    const k = 4;
    let currentAlpha = initialAlpha;
    for (let i = 0; i <= 1; i += stepSize) {
        radialGradient.addColorStop(i, `rgba(${rgb}, ${calculateExponentialAlpha(currentAlpha, k, i)})`);
        currentAlpha = calculateExponentialAlpha(initialAlpha, k, i);
    }
    radialGradient.addColorStop(1, `rgba(${rgb}, 0)`);

    ctx.fillStyle = radialGradient;
    ctx.arc(meteor.position.x, meteor.position.y, meteor.length / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function animateMeteor(meteor: Meteor, width: number, height: number) {
    meteor.position.x += meteor.velocity.x;
    meteor.position.y += meteor.velocity.y;

    if (meteor.position.x < 0 || meteor.position.x > width || meteor.position.y < 0 || meteor.position.y > height) {
        meteor.position.x = random() * width;
        meteor.position.y = random() * height;
    }
}

interface ThemeColor {
    theme: string;
    bg: string;
    bg_rgb: [number, number, number];
}

function getThemeColor(theme = getTheme()): ThemeColor {
    if (theme === "light") {
        return {
            theme: "light",
            bg: "#313439",
            bg_rgb: [49, 52, 57],
        };
    }

    return {
        theme: "dark",
        bg: "#E1E4E9",
        bg_rgb: [225, 228, 233],
    };
}

function getTheme() {
    if (document.documentElement.classList.contains("light")) return "light";
    return "dark";
}

function random() {
    return m.random();
}

function calculateExponentialAlpha(initialAlpha: number, k: number, stepSize: number) {
    return initialAlpha * Math.exp(-k * stepSize);
}

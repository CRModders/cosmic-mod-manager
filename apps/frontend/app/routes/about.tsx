import MarkdownRenderBox from "~/components/md-renderer";

export default function AboutPage() {
    return (
        <main className="w-full grid grid-cols-1">
            <MarkdownRenderBox
                className="max-w-[72ch] bright-heading mx-auto bg-card-background p-6 pt-0 rounded-lg"
                text={`

#**About Us**

Welcome to **CRMM** – the **Cosmic Reach Mod Manager**.
We’re a passionate team dedicated to making it as easy and convenient as possible to share and discover downloadable content for *Cosmic Reach*. Whether you're a mod developer, world builder, or just someone who loves customising their experience, CRMM is here to give your creativity a home.

CRMM was launched on **10 March 2024**, born from the idea of creating a central place to share everything made for Cosmic Reach. Inspired by platforms like Modrinth, we set out to build something cleaner, faster, and tailored to our own community. And while we still have a long journey ahead, we’re proud of how far we’ve already come.

### Our Mission

Our goal is simple:
To **empower creators** and **make content sharing seamless**. From mods and maps to texture packs and shaders, we've given creators a way to share what they make – and users a way to enjoy it, effortlessly.

### Meet the Team

While CRMM is a community-driven effort, here are some of the core people behind it:

* **Abhinav** – *The coder wizard*. He built the backend and frontend of the site. If something needs fixing or building, he's the one who gets it done.
* **Eatham** – *The idea guy*. Helped get CRMM off the ground and was there from the very beginning.
* **Spicylemon** – *The manager, logo designer, and grammar checker (when he remembers)*. Oversees the project and keeps everything running smoothly.
* **Hellscaped (Riley)** – *The Owner of CRM*, the main project we merged with shortly after launching.
* **CaptainDynamite** – Helps with funding the project, been there since the start.
* **Dounford & Arlojay** – Provided general help during CRMM’s early days.
* **CRM** – Our “parent” project and a key part of our roots.

Although lots of folks pitch in now and then – mostly via Discord – the day-to-day work is mainly handled by Spicylemon and Abhinav with a few herbes and spices thrown in by Eatham.

And of course, **huge thanks to FinalForEach**, the creator of *Cosmic Reach*, for building such a unique game and giving us this amazing community to build around.

### How It All Works

We self-host CRMM and use open-source, community-friendly tools:

* **Clickhouse DB** (self-hosted) for fast and efficient analytics
* **Uptime Kuma** (also self-hosted) for monitoring
* **Cloudflare** and **Fastly** for security and delivery

Everything is designed to be lightweight, privacy-friendly, and run with the modding community in mind.

### Community & Contributions

CRMM is **open-source and community-powered** under the *GNU Affero General Public License*.
Users can help translate the site, suggest features, or (if they're feeling bold) even contribute directly via [our GitHub repository](https://github.com/CRModders/cosmic-mod-manager). It doesn’t happen often, but when it does, we appreciate it deeply.

Want to get involved?
Join our [CRM Discord](https://discord.gg/45CuhYkv3B) and say hello. Whether you’re looking to contribute or just hang out with fellow modders, you’re welcome here.

### What’s Next?

It's still the early days here, but big things are upon the horizon. From **moderation tools** to **VirusTotal integration**, improved **project reporting**, and more – we’re always building toward a bigger and better platform.

Thank *YOU* for being a part of the CRMM community.
We can’t wait to see what you create ;).
            `}
            />
        </main>
    );
}

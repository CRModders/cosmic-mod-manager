export interface PrivacyProps {
    title: string;
    supportEmail: string;
}

export function PrivacyPolicy(props: PrivacyProps) {
    return `
# ${props.title}

*Last modified: May 3, 2025*

### **Introduction**

Cosmic Reach Mod Manager (CRMM) is operated by a group of developers and managers ("we", "our", "us"). This privacy policy explains how we collect, use, and protect your data when you access our website, *[www.crmm.tech](http://www.crmm.tech)* ("Service" or "Website"). It also outlines your rights regarding your data.

By using our Service, you agree to the collection and use of your data as described in this policy. If you do not agree with these terms, please do not use our Website.

This policy may change from time to time, and any changes will be posted on this page with an updated "Last modified" date.

### **What Data Do We Collect?**

#### **User Data**

When you sign up or log in to CRMM, we collect the following data:

* **Email address** (used for registration and account communication)
* **Username** (unique identifier)
* **Avatar** (optional, profile picture)
* **Name** (optional)
* **Bio** (optional)
* **Password** (only stored securely if you sign up via email and password)
* **Date of Account Creation**
* **Email Verification Status** (whether your email has been verified)
* **Role** (your role within CRMM, e.g., user, admin)
* **New Sign-In Alerts Preference** (whether you wish to receive alerts about new sign-ins)

When a session is created, the data above will be linked to the session. We also store information about:

* **Auth Accounts** (linked third-party accounts such as Google, GitHub, Discord, or GitLab)
* **Project Followings** (IDs of projects you are following)
* **Team Memberships** (if applicable)
* **Notifications** (updates from the platform)

#### **Third-Party Data Collection**

We use third-party services for our infrastructure, including:

* **Cloudflare**
* **Fastly**

These services help improve the performance and security of our services.

We also self-host open-source software such as **Clickhouse DB** and **Uptime Kuma** for system monitoring and database management.

#### **No Monetization**

We do not monetize user data and have no plans for monetization at this time.

### **Data Retention**

We store your data as long as needed for the operation of the Service.Fastly You can request the deletion of your data at any time. Once deleted, your data will no longer be accessible, but may remain in backup systems for a short period.

### **Your Rights and Requests**

You have the right to request the deletion of your personal data from our systems. However, we do not provide full access to all the data we store as much of it is what you've already provided.

To request deletion of your data, please contact us at **[${props.supportEmail}](mailto:${props.supportEmail})**, or go to **[account settings](https://crmm.tech/settings/account)** and scroll down to "Delete account" and follow the steps on-screen.

### **Third-Party Services**

We do not share your personal data with any third-party service providers for marketing purposes. Our third-party service providers include:

* **Cloudflare** (for performance and security)
* **Fastly** (for content delivery)
* **Clickhouse DB** (for database management)
* **Uptime Kuma** (for monitoring the website’s uptime)

### **Children’s Privacy**

We do not specifically collect personal data from children under the age of 13. Our Service is not directed at children, and we encourage parents and guardians to monitor and control their children's online activities.

If we become aware that a child under 13 has provided personal information, we will make every effort to remove that information from our records.

### **Cookies**

We use cookies to:

* Log you into your account
* Save your cosmetic preferences

You can set your browser to block or alert you about cookies. However, disabling cookies may affect certain features of the Website.

### **Changes to the Privacy Policy**

We may update this privacy policy from time to time. We will post any changes on this page and update the "Last modified" date. Your continued use of the Website after any changes will be deemed as acceptance of the updated privacy policy.

### **Contact Us**

If you have any questions about this privacy policy or how we handle your data, please contact us at [${props.supportEmail}](mailto:${props.supportEmail})
`;
}

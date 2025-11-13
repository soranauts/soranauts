# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest (main branch) | ✅ |
| Astro 5.x | ✅ |
| Node 20 LTS | ✅ |
| PNPM 9.x | ✅ |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in the Soranauts monorepo, please report it responsibly.

### Where to Report

**Preferred Method: GitHub Security Advisories**

1. Navigate to the [Security Advisories](https://github.com/soranauts/soranauts/security/advisories) page
2. Click "Report a vulnerability"
3. Fill out the advisory form with details

**Alternative: Private Email**

If you cannot use GitHub Security Advisories, contact the maintainers directly via the project's private communication channels.

### What to Include

Please provide:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential security impact and affected components
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Suggested fix**: If you have recommendations (optional)
- **Disclosure timeline**: Your preferred disclosure timeline

### What to Expect

- **Acknowledgment**: Within 48 hours of report
- **Initial assessment**: Within 5 business days
- **Status updates**: Regular updates on progress
- **Resolution**: Fix timeline depends on severity (critical: days, low: weeks)
- **Credit**: Public acknowledgment in release notes (if desired)

### Scope

**In Scope:**
- Monorepo code and configurations
- Build and deployment scripts
- CI/CD workflows
- Dependencies with known vulnerabilities

**Out of Scope:**
- Third-party dependencies (report to upstream projects)
- Social engineering attacks
- Physical security
- Denial of service attacks against the public website

## Security Best Practices

When contributing to the repository:

- **Never commit secrets**: Use environment variables for sensitive data
- **Review dependencies**: Check for known vulnerabilities before adding new packages
- **Follow principle of least privilege**: API endpoints should have minimal required permissions
- **Validate inputs**: Use Zod schemas for all user inputs and API boundaries
- **Protected paths**: Never modify content or page files unless explicitly approved

## Security Updates

Security updates are released as:

- **Critical**: Immediate patch release
- **High**: Patch within 7 days
- **Medium**: Included in next minor release
- **Low**: Included in next major/minor release

Subscribe to repository releases and security advisories to stay informed.


# Github Project

[English](#english) | [Polski](#polski)

---

## English

**Github Project** is a Strapi v5 plugin that integrates with the GitHub API to manage project entries from your GitHub repositories.

### Features

- **Import from GitHub** — Fetch your public repositories from GitHub and display them in the Strapi admin panel
- **Create projects** — Turn selected repositories into Strapi project entries with one click
- **Bulk operations** — Create or delete multiple projects at once
- **README import** — Automatically fetches and converts each repository's README.md to HTML for the long description
- **Content management** — Edit projects in Strapi Content Manager, add cover images, and extend with custom content

### Configuration

Set the following environment variables in your Strapi application:

- `GITHUB_USER` (required) — Your GitHub username
- `GITHUB_TOKEN` (optional) — Personal access token for higher API rate limits and private repositories

### Installation

```bash
npm install @mr-json/strapi-plugin-github-projects
```

---

## Polski

**Github Project** to wtyczka do Strapi v5 integrująca się z API GitHub w celu zarządzania wpisami projektów z repozytoriów GitHub.

### Funkcje

- **Import z GitHuba** — Pobieranie publicznych repozytoriów z GitHuba i wyświetlanie ich w panelu administracyjnym Strapi
- **Tworzenie projektów** — Zamiana wybranych repozytoriów na wpisy projektów w Strapi jednym kliknięciem
- **Operacje zbiorcze** — Tworzenie lub usuwanie wielu projektów naraz
- **Import README** — Automatyczne pobieranie i konwersja pliku README.md każdego repozytorium do HTML jako długi opis
- **Zarządzanie treścią** — Edycja projektów w menedżerze treści Strapi, dodawanie obrazów okładek i rozszerzanie własną zawartością

### Konfiguracja

Ustaw następujące zmienne środowiskowe w aplikacji Strapi:

- `GITHUB_USER` (wymagane) — Nazwa użytkownika GitHub
- `GITHUB_TOKEN` (opcjonalne) — Token dostępu osobistego dla wyższych limitów API i repozytoriów prywatnych

### Instalacja

```bash
npm install @mr-json/strapi-plugin-github-projects
```

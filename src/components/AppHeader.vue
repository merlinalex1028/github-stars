<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const langDropdownOpen = ref(false)

const locales = [
  { code: 'en', label: 'EN', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'zh', label: '中文', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ja', label: '日本語', flag: '\u{1F1EF}\u{1F1F5}' },
]

const currentLocale = () => locales.find(l => l.code === locale.value) || locales[0]

function setLocale(code: string) {
  locale.value = code
  localStorage.setItem('locale', code)
  langDropdownOpen.value = false
}

function navigate(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
}

function closeLangDropdown() {
  langDropdownOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo" @click="navigate('/')">
        <span class="logo-icon">&#9672;</span>
        <span class="logo-text">GitPulse</span>
      </div>

      <nav class="nav-links" :class="{ open: mobileMenuOpen }">
        <a
          class="nav-link"
          :class="{ active: route.path === '/' }"
          @click="navigate('/')"
        >
          {{ t('nav.trending') }}
        </a>
        <a
          class="nav-link"
          :class="{ active: route.path === '/languages' }"
          @click="navigate('/languages')"
        >
          {{ t('nav.languages') }}
        </a>
        <a
          class="nav-link"
          :class="{ active: route.path === '/topics' }"
          @click="navigate('/topics')"
        >
          {{ t('nav.topics') }}
        </a>
        <a
          class="nav-link"
          :class="{ active: route.path === '/about' }"
          @click="navigate('/about')"
        >
          {{ t('nav.about') }}
        </a>
      </nav>

      <div class="lang-switcher" @mouseleave="closeLangDropdown">
        <button class="lang-switcher__btn" @click="toggleLangDropdown">
          <span class="lang-switcher__flag">{{ currentLocale().flag }}</span>
          <span class="lang-switcher__label">{{ currentLocale().label }}</span>
          <span class="lang-switcher__arrow" :class="{ open: langDropdownOpen }">&#9662;</span>
        </button>
        <div v-if="langDropdownOpen" class="lang-switcher__dropdown">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="lang-switcher__option"
            :class="{ active: locale === loc.code }"
            @click="setLocale(loc.code)"
          >
            <span class="lang-switcher__flag">{{ loc.flag }}</span>
            <span>{{ loc.label }}</span>
          </button>
        </div>
      </div>

      <button
        class="mobile-toggle"
        aria-label="Toggle menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span :class="{ open: mobileMenuOpen }"></span>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
$header-height: 60px;

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: $header-height;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border-bottom: 1px solid rgba(99, 102, 241, 0.08);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.logo-icon {
  font-size: 22px;
  color: #4f6df5;
  text-shadow: 0 0 6px rgba(79, 109, 245, 0.2);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #4f6df5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    color: #1e293b;
    background: rgba(99, 102, 241, 0.06);
  }

  &.active {
    color: #4f6df5;
    background: rgba(79, 109, 245, 0.08);
    box-shadow: 0 1px 4px rgba(79, 109, 245, 0.1);
  }
}

.lang-switcher {
  position: relative;

  &__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid rgba(99, 102, 241, 0.12);
    border-radius: 8px;
    background: rgba(99, 102, 241, 0.04);
    color: #475569;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      background: rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.2);
      color: #1e293b;
    }
  }

  &__flag {
    font-size: 16px;
    line-height: 1;
  }

  &__arrow {
    font-size: 10px;
    transition: transform 0.2s;

    &.open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 130px;
    background: #fff;
    border: 1px solid rgba(99, 102, 241, 0.12);
    border-radius: 10px;
    padding: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    z-index: 200;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #475569;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: rgba(99, 102, 241, 0.06);
      color: #1e293b;
    }

    &.active {
      color: #4f6df5;
      background: rgba(79, 109, 245, 0.06);
    }
  }
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  position: relative;
  cursor: pointer;

  span,
  span::before,
  span::after {
    display: block;
    width: 20px;
    height: 2px;
    background: #1e293b;
    border-radius: 2px;
    transition: all 0.3s;
    position: absolute;
    left: 4px;
  }

  span {
    top: 13px;

    &::before {
      content: '';
      top: -7px;
    }

    &::after {
      content: '';
      top: 7px;
    }

    &.open {
      background: transparent;

      &::before {
        top: 0;
        transform: rotate(45deg);
      }

      &::after {
        top: 0;
        transform: rotate(-45deg);
      }
    }
  }
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }

  .nav-links {
    position: absolute;
    top: $header-height;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(18px);
    padding: 12px 24px;
    border-bottom: 1px solid rgba(99, 102, 241, 0.08);
    display: none;

    &.open {
      display: flex;
    }
  }

  .lang-switcher {
    margin-left: auto;
    margin-right: 12px;
  }
}
</style>

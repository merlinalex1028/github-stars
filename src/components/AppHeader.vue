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
  background: #ffffff;
  border-bottom: 2px dashed #d1d5db;
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
  font-size: 24px;
  color: #374151;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Caveat', cursive;
  color: #1f2937;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 3px;
  font-size: 14px;
  font-family: 'Patrick Hand', cursive;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #1f2937;
    border-bottom: 2px dashed #d1d5db;
  }

  &.active {
    color: #1f2937;
    border-bottom: 2px solid #1f2937;
    font-weight: 600;
  }
}

.lang-switcher {
  position: relative;

  &__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1.5px solid #d1d5db;
    border-radius: 3px;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    font-family: 'Patrick Hand', cursive;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      border-color: #9ca3af;
      color: #1f2937;
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
    background: #ffffff;
    border: 1.5px solid #d1d5db;
    border-radius: 3px;
    padding: 4px;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.06);
    z-index: 200;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 2px;
    background: transparent;
    color: #374151;
    font-size: 13px;
    font-family: 'Patrick Hand', cursive;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: #faf8f4;
      color: #1f2937;
    }

    &.active {
      color: #1f2937;
      font-weight: 600;
      background: #fef9c3;
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
    background: #1f2937;
    border-radius: 1px;
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
    background: #ffffff;
    padding: 12px 24px;
    border-bottom: 2px dashed #d1d5db;
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

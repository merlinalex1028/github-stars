<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Trending', path: '/' },
  { label: 'Languages', path: '/languages' },
  { label: 'Topics', path: '/topics' },
  { label: 'About', path: '/about' },
]

function navigate(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
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
          v-for="link in navLinks"
          :key="link.path"
          class="nav-link"
          :class="{ active: route.path === link.path }"
          @click="navigate(link.path)"
        >
          {{ link.label }}
        </a>
      </nav>

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
  background: rgba(10, 10, 30, 0.65);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border-bottom: 1px solid rgba(100, 200, 255, 0.08);
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
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #00e5ff, #7c4dff);
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
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    color: #fff;
    background: rgba(100, 200, 255, 0.08);
  }

  &.active {
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.1);
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.15);
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
    background: #fff;
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
    background: rgba(10, 10, 30, 0.95);
    backdrop-filter: blur(18px);
    padding: 12px 24px;
    border-bottom: 1px solid rgba(100, 200, 255, 0.08);
    display: none;

    &.open {
      display: flex;
    }
  }
}
</style>

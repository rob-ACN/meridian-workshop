<template>
  <div class="app">
    <header class="top-nav">
      <div class="nav-container">
        <div class="logo">
          <h1>{{ t('nav.companyName') }}</h1>
          <span class="subtitle">{{ t('nav.subtitle') }}</span>
        </div>
        <nav class="nav-tabs">
          <router-link to="/" :class="{ active: $route.path === '/' }">
            {{ t('nav.overview') }}
          </router-link>
          <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }">
            {{ t('nav.inventory') }}
          </router-link>
          <router-link to="/orders" :class="{ active: $route.path === '/orders' }">
            {{ t('nav.orders') }}
          </router-link>
          <router-link to="/spending" :class="{ active: $route.path === '/spending' }">
            {{ t('nav.finance') }}
          </router-link>
          <router-link to="/demand" :class="{ active: $route.path === '/demand' }">
            {{ t('nav.demandForecast') }}
          </router-link>
          <router-link to="/reports" :class="{ active: $route.path === '/reports' }">
            {{ t('nav.reports') }}
          </router-link>
          <router-link to="/restocking" :class="{ active: $route.path === '/restocking' }">
            {{ t('nav.restocking') }}
          </router-link>
        </nav>
        <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </header>
    <FilterBar />
    <main class="main-content">
      <router-view />
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const { theme, toggleTheme } = useTheme()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      theme, toggleTheme,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
/* ── Design tokens ─────────────────────────────────────────── */
:root {
  --color-primary:          #6366f1;
  --color-primary-light:    #eef2ff;
  --color-primary-hover:    #4f46e5;
  --color-primary-glow:     rgba(99, 102, 241, 0.15);

  --color-bg:               #f1f5f9;
  --color-surface:          #ffffff;
  --color-border:           #e2e8f0;
  --color-border-hover:     #cbd5e1;

  --color-text:             #0f172a;
  --color-text-secondary:   #475569;
  --color-text-muted:       #94a3b8;

  --color-success-bg:       #d1fae5;
  --color-success-text:     #065f46;
  --color-warning-bg:       #fef3c7;
  --color-warning-text:     #92400e;
  --color-danger-bg:        #fee2e2;
  --color-danger-text:      #991b1b;
  --color-info-bg:          #eef2ff;
  --color-info-text:        #4338ca;

  --shadow-sm:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:    0 4px 16px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06);
  --shadow-hover: 0 8px 32px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.08);
  --shadow-nav:   0 4px 32px rgba(0,0,0,0.4);

  --radius-sm:    6px;
  --radius-md:    12px;
  --radius-lg:    16px;
}

/* ── Dark mode tokens ──────────────────────────────────────── */
[data-theme="dark"] {
  --color-primary:          #818cf8;
  --color-primary-light:    #1e1b4b;
  --color-primary-hover:    #a5b4fc;
  --color-primary-glow:     rgba(129, 140, 248, 0.15);

  --color-bg:               #0b1120;
  --color-surface:          #111827;
  --color-border:           #1f2937;
  --color-border-hover:     #374151;

  --color-text:             #f9fafb;
  --color-text-secondary:   #9ca3af;
  --color-text-muted:       #6b7280;

  --color-success-bg:       #052e16;
  --color-success-text:     #34d399;
  --color-warning-bg:       #1c1917;
  --color-warning-text:     #fbbf24;
  --color-danger-bg:        #450a0a;
  --color-danger-text:      #f87171;
  --color-info-bg:          #1e1b4b;
  --color-info-text:        #a5b4fc;

  --shadow-sm:    0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:    0 4px 16px rgba(0,0,0,0.5);
  --shadow-hover: 0 8px 32px rgba(0,0,0,0.65);
  --shadow-nav:   0 4px 32px rgba(0,0,0,0.6);
}

/* ── Reset ─────────────────────────────────────────────────── */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Navigation — always dark ──────────────────────────────── */
.top-nav {
  background: #0d1424;
  box-shadow: var(--shadow-nav);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 64px;
  gap: 0;
}

.nav-container > .nav-tabs       { margin-left: auto; margin-right: 1rem; }
.nav-container > .language-switcher { margin-right: 0.75rem; }

/* Logo */
.logo { display: flex; align-items: center; gap: 0.75rem; }

.logo h1 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.78rem;
  color: #475569;
  padding-left: 0.75rem;
  border-left: 1px solid #1e293b;
  white-space: nowrap;
}

/* Nav links */
.nav-tabs { display: flex; gap: 2px; }

.nav-tabs a {
  padding: 0.45rem 0.875rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.nav-tabs a:hover {
  color: #e2e8f0;
  background: rgba(255,255,255,0.06);
}

.nav-tabs a.active {
  color: #fff;
  background: rgba(99,102,241,0.2);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 0 #818cf8;
}

/* Theme toggle on dark nav */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #64748b;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.theme-toggle:hover {
  background: rgba(255,255,255,0.1);
  color: #e2e8f0;
  border-color: rgba(255,255,255,0.2);
}

/* Language switcher on dark nav */
.top-nav .language-button {
  background: rgba(255,255,255,0.04) !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: #94a3b8 !important;
}
.top-nav .language-button:hover {
  background: rgba(255,255,255,0.09) !important;
  border-color: rgba(255,255,255,0.2) !important;
  color: #e2e8f0 !important;
}
.top-nav .language-label,
.top-nav .globe-icon,
.top-nav .chevron { color: inherit !important; }

/* ── Main content ──────────────────────────────────────────── */
.main-content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 1.75rem 2rem;
}

/* ── Page header ───────────────────────────────────────────── */
.page-header { margin-bottom: 1.5rem; }

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  letter-spacing: -0.025em;
}

.page-header p { color: var(--color-text-secondary); font-size: 0.9rem; }

/* ── Stats grid ────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: var(--color-surface);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s, transform 0.25s;
}

.stat-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}

.stat-card.info    { border-top-color: var(--color-primary); }
.stat-card.success { border-top-color: #10b981; }
.stat-card.warning { border-top-color: #f59e0b; }
.stat-card.danger  { border-top-color: #ef4444; }

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.stat-card.warning .stat-value { color: #d97706; }
.stat-card.success .stat-value { color: #059669; }
.stat-card.danger  .stat-value { color: #dc2626; }
.stat-card.info    .stat-value { color: var(--color-primary); }

/* ── Cards ─────────────────────────────────────────────────── */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.25rem;
  transition: box-shadow 0.25s, transform 0.25s;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

/* ── Tables ────────────────────────────────────────────────── */
.table-container { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

thead { border-bottom: 2px solid var(--color-border); }

th {
  text-align: left;
  padding: 0.625rem 0.875rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  background: var(--color-bg);
}

td {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.875rem;
}

tbody tr { transition: background 0.12s; }
tbody tr:hover { background: var(--color-primary-light); }
tbody tr:last-child td { border-bottom: none; }

/* ── Badges — pill shape ───────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge.success, .badge.increasing { background: var(--color-success-bg); color: var(--color-success-text); }
.badge.warning                    { background: var(--color-warning-bg); color: var(--color-warning-text); }
.badge.danger,  .badge.decreasing { background: var(--color-danger-bg);  color: var(--color-danger-text);  }
.badge.info,    .badge.stable     { background: var(--color-info-bg);    color: var(--color-info-text);    }
.badge.high                       { background: var(--color-danger-bg);  color: var(--color-danger-text);  }
.badge.medium                     { background: var(--color-warning-bg); color: var(--color-warning-text); }
.badge.low                        { background: var(--color-info-bg);    color: var(--color-info-text);    }

/* ── Dark mode overrides ───────────────────────────────────── */
[data-theme="dark"] .kpi-section {
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

[data-theme="dark"] .card,
[data-theme="dark"] .stat-card,
[data-theme="dark"] .kpi-card,
[data-theme="dark"] .budget-bar,
[data-theme="dark"] .chart-container,
[data-theme="dark"] .bar-chart,
[data-theme="dark"] .filter-bar,
[data-theme="dark"] .filter-select,
[data-theme="dark"] .modal-content,
[data-theme="dark"] .modal-body,
[data-theme="dark"] .task-item,
[data-theme="dark"] .trend-card,
[data-theme="dark"] .order-row,
[data-theme="dark"] .expanded-items,
[data-theme="dark"] .dropdown-menu,
[data-theme="dark"] .language-button,
[data-theme="dark"] .profile-dropdown {
  background: var(--color-surface) !important;
  border-color: var(--color-border) !important;
}

/* Nav language button always takes dark-nav style regardless of theme */
.top-nav .language-button {
  background: rgba(255,255,255,0.04) !important;
  border-color: rgba(255,255,255,0.1) !important;
  color: #94a3b8 !important;
}
.top-nav .language-button:hover {
  background: rgba(255,255,255,0.09) !important;
  border-color: rgba(255,255,255,0.2) !important;
  color: #e2e8f0 !important;
}

[data-theme="dark"] thead th { background: var(--color-bg) !important; }
[data-theme="dark"] tbody tr:hover { background: rgba(129,140,248,0.07) !important; }
[data-theme="dark"] td { border-bottom-color: var(--color-border) !important; }

[data-theme="dark"] .stat-label,
[data-theme="dark"] .bar-label,
[data-theme="dark"] .filter-group label { color: var(--color-text-secondary) !important; }

[data-theme="dark"] .stat-value,
[data-theme="dark"] .kpi-value,
[data-theme="dark"] .kpi-amount,
[data-theme="dark"] .summary-value,
[data-theme="dark"] .order-stat-value,
[data-theme="dark"] .card-title,
[data-theme="dark"] td,
[data-theme="dark"] th,
[data-theme="dark"] .filter-select,
[data-theme="dark"] .dropdown-item,
[data-theme="dark"] select,
[data-theme="dark"] input { color: var(--color-text) !important; }

[data-theme="dark"] .stat-value,
[data-theme="dark"] .kpi-value,
[data-theme="dark"] .health-metric-value,
[data-theme="dark"] .kpi-amount,
[data-theme="dark"] .summary-value,
[data-theme="dark"] .order-stat-value { color: #f9fafb !important; }

[data-theme="dark"] .donut-center-value,
[data-theme="dark"] .donut-center-label { fill: #f9fafb !important; }

[data-theme="dark"] select,
[data-theme="dark"] input:not([type="range"]) {
  background: var(--color-surface) !important;
  border-color: var(--color-border) !important;
}

[data-theme="dark"] .dropdown-item:hover,
[data-theme="dark"] .profile-dropdown a:hover { background: var(--color-bg) !important; }

/* ── States ────────────────────────────────────────────────── */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.error {
  background: var(--color-danger-bg);
  border: 1px solid #fca5a5;
  color: var(--color-danger-text);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  font-size: 0.9rem;
}
</style>

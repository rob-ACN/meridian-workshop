<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on stock levels, demand forecast, and your budget</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <div class="budget-input-group">
        <label>Budget Ceiling</label>
        <div class="input-wrap">
          <span class="currency-prefix">{{ currencySymbol }}</span>
          <input
            v-model.number="budgetInput"
            type="number"
            min="0"
            step="1000"
            placeholder="Enter budget..."
            @change="loadRecommendations"
          />
        </div>
      </div>
      <div v-if="budget > 0" class="budget-summary">
        <div class="budget-stat">
          <span class="budget-label">Total estimated spend</span>
          <span class="budget-value">{{ formatAmount(totalEstimatedCost) }}</span>
        </div>
        <div class="budget-stat">
          <span class="budget-label">Remaining budget</span>
          <span class="budget-value" :class="remainingBudget < 0 ? 'over' : 'ok'">
            {{ formatAmount(remainingBudget) }}
          </span>
        </div>
        <div class="budget-stat">
          <span class="budget-label">Items covered</span>
          <span class="budget-value">{{ recommendations.length }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="recommendations.length === 0" class="empty">
      <p>No restocking needed{{ budget > 0 ? ' within current budget' : '' }}. All items are adequately stocked.</p>
    </div>
    <div v-else class="card">
      <div class="card-header">
        <h3 class="card-title">Recommended Purchase Orders</h3>
        <span class="rec-count">{{ recommendations.length }} items</span>
      </div>
      <div class="table-container">
        <table class="restocking-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>SKU</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>On Hand</th>
              <th>Reorder Point</th>
              <th>Forecasted Demand</th>
              <th>Recommended Qty</th>
              <th>Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in recommendations" :key="rec.sku + rec.warehouse" :class="rec.partial ? 'partial-row' : ''">
              <td>
                <span :class="'badge ' + rec.priority">{{ rec.priority }}</span>
              </td>
              <td class="mono">{{ rec.sku }}</td>
              <td>{{ rec.name }}<span v-if="rec.partial" class="partial-note"> (partial)</span></td>
              <td>{{ rec.warehouse }}</td>
              <td :class="rec.quantity_on_hand <= rec.reorder_point ? 'low-stock' : ''">
                {{ rec.quantity_on_hand }}
              </td>
              <td>{{ rec.reorder_point }}</td>
              <td>{{ rec.forecasted_demand }}</td>
              <td class="qty">{{ rec.recommended_qty }}</td>
              <td class="cost">{{ formatAmount(rec.estimated_cost) }}</td>
            </tr>
          </tbody>
          <tfoot v-if="budget > 0">
            <tr class="total-row">
              <td colspan="8" class="total-label">Total estimated spend</td>
              <td class="cost">{{ formatAmount(totalEstimatedCost) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { formatCurrency } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const { getCurrentFilters } = useFilters()
    const { currentCurrency } = useI18n()

    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref(null)
    const budget = computed(() => budgetInput.value > 0 ? budgetInput.value : null)

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const totalEstimatedCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )
    const remainingBudget = computed(() =>
      budget.value !== null ? budget.value - totalEstimatedCost.value : null
    )

    const formatAmount = (num) => formatCurrency(num, currentCurrency.value)

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations(
          { warehouse: filters.warehouse, category: filters.category },
          budget.value
        )
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch(getCurrentFilters, loadRecommendations, { deep: true })
    onMounted(loadRecommendations)

    return {
      loading, error, recommendations,
      budgetInput, budget,
      currencySymbol, totalEstimatedCost, remainingBudget,
      formatAmount, loadRecommendations
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.budget-input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-right: 1px solid #e2e8f0;
}

.input-wrap input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  width: 160px;
  color: #0f172a;
}

.budget-summary {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.budget-stat { text-align: center; }
.budget-label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 2px; }
.budget-value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.budget-value.over { color: #dc2626; }
.budget-value.ok { color: #16a34a; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title { font-size: 1.25rem; font-weight: 600; color: #0f172a; }
.rec-count { font-size: 0.875rem; color: #64748b; background: #f1f5f9; padding: 3px 10px; border-radius: 20px; }

.restocking-table { width: 100%; border-collapse: collapse; }
.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.restocking-table td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
.restocking-table tr:hover { background: #f8fafc; }
.restocking-table tr:last-child td { border-bottom: none; }

.partial-row { opacity: 0.75; }
.partial-note { font-size: 0.75rem; color: #94a3b8; }

.mono { font-family: monospace; font-size: 0.85rem; color: #475569; }
.low-stock { color: #dc2626; font-weight: 600; }
.qty { font-weight: 600; color: #0f172a; }
.cost { font-weight: 600; color: #0f172a; }

.total-row td { border-top: 2px solid #e2e8f0; font-weight: 700; color: #0f172a; }
.total-label { text-align: right; color: #64748b; }

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.badge.high { background: #fee2e2; color: #991b1b; }
.badge.medium { background: #fef3c7; color: #92400e; }
.badge.low { background: #dcfce7; color: #166534; }

.loading, .empty { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; }
</style>

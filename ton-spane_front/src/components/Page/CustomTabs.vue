<template>
  <div class="tabs">
    <div class="tabs-header">
      <div class="indicator" :style="indicatorStyle"></div>
      <button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        @click="setActiveTab(tab.name, index)"
        :class="['tab-btn', { active: activeTab === tab.name }]"
        ref="tabButtons"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <Transition name="tab-fade" mode="out-in">
        <div v-show="activeTab === 'first'" key="first">
          <slot name="first"></slot>
        </div>
      </Transition>
      <Transition name="tab-fade" mode="out-in">
        <div v-show="activeTab === 'second'" key="second">
          <slot name="second"></slot>
        </div>
      </Transition>
      <Transition name="tab-fade" mode="out-in">
        <div v-show="activeTab === 'third'" key="third">
          <slot name="third"></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('first')
const activeIndex = ref(0)
const tabButtons = ref([])

const tabs = [
  { name: 'first', label: 'Для вас' },
  { name: 'second', label: 'Подписки' },
  { name: 'third', label: 'Понравилось' }
]

const indicatorStyle = computed(() => {
  if (!tabButtons.value[activeIndex.value]) return {}
  const button = tabButtons.value[activeIndex.value]
  return {
    width: button.offsetWidth + 'px',
    transform: `translateX(${button.offsetLeft}px)`
  }
})

const setActiveTab = (name, index) => {
  activeTab.value = name
  activeIndex.value = index
}
</script>

<style scoped>
.tabs {
  width: fit-content;
  min-width: 100%;
  margin: 0px auto;
}

.tabs-header {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.indicator {
  position: absolute;
  height: calc(100% - 16px);
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  top: 8px;
  left: 0px;
  z-index: 0;
}

.tab-btn {
  flex: 1;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #bdbdbd;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.tab-btn:hover {
  color: #ffffff;
}

.tab-btn.active {
  color: white;
}

.tabs-content {
  margin-top: 24px;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:deep(html.dark) .tab-btn {
  color: #94a3b8;
}

:deep(html.dark) .tab-btn:hover {
  color: #e2e8f0;
}

@media (max-width: 640px) {
  .tabs {
    min-width: 100%;
    margin-top: 20px;
  }
  
  .tab-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
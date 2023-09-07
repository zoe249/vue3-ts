import type { ComponentCustomProperties } from 'vue'
import { getCurrentInstance } from 'vue'
export function useProxy() {
  return getCurrentInstance() as { proxy: ComponentCustomProperties }
}

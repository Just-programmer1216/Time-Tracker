import { createApp } from 'vue'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/500.css'
import '@fontsource/nunito/600.css'
import './style.css'
// Застосовує збережений масштаб UI до першого рендеру, щоб не було блимання.
import './composables/useUiScale'
// Запускає планувальник нагадувань одразу при старті, якщо вони ввімкнені.
import './composables/useReminders'
import App from './App.vue'

createApp(App).mount('#app')

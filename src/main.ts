import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import phila-ui-core CSS for design system variables and button styles
// import '@phila/phila-ui-core/dist/styles/variables.css'
// import '@phila/phila-ui-core/dist/styles/light-mode.css'
// import '@phila/phila-ui-core/dist/styles/elements/buttons.css'

// FontAwesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faLocationCrosshairs,
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(faLocationCrosshairs)

const app = createApp(App)

// Register FontAwesome component globally
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(createPinia())

app.mount('#app')

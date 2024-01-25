/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes:
      {
        dark: {
          colors: {
            noir: "#080f05",
            background:
              "#0a0734",
            primary:
              "#130e58",
            white:
              "#E5F0E2",
            error:
              "#FF5252",
            info:
              "#2196F3",
            success:
              "#4CAF50",
            warning:
              "#FFC107",
            blackOlive:
              "#22351B",
          }
          ,
        }
        ,
      }
  },
  defaults: {
    global: {}
    ,
    VFileInput: {
      variant: "outlined",
      color:
        "success",
      density:
        "compact",
    }
    ,
    VTextField: {
      variant: "outlined",
      color:
        "success",
      density:
        "compact",
      clearable:
        true,
    }
    ,
    VTextarea: {
      variant: "outlined",
      color:
        "success",
      counter:
        true,
    }
    ,
    VAutocomplete: {
      variant: "outlined",
      color:
        "success",
      density:
        "compact",
      clearable:
        true,
    }
    ,
    VCombobox: {
      variant: "outlined",
      color:
        "success",
      density:
        "compact",
    }
    ,
    VSelect: {
      variant: "outlined",
      color:
        "success",
      density:
        "compact",
    }
    ,
    VCheckbox: {
      color: "success",
    }
    ,
    VRadio: {
      color: "success",
    }
    ,
    VSwitch: {
      color: "success",
    }
    ,
    VSheet: {
      rounded: true,
    }
    ,
  },
})

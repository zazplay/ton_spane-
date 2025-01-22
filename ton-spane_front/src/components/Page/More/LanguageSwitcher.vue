<template>
    <div class="language-switcher">
      <el-select 
        v-model="selectedLanguage" 
        class="language-select" 
        @change="handleLanguageChange"
      >
        <el-option
          v-for="lang in languages"
          :key="lang.code"
          :label="lang.name"
          :value="lang.code"
        >
          <div class="language-option">
            <span class="language-flag">{{ lang.code === 'ru' ? '🇷🇺' : '🇬🇧' }}</span>
            <span class="language-name">{{ lang.name }}</span>
          </div>
        </el-option>
      </el-select>
      <div id="google_translate_element" style="display: none;"></div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  export default {
    name: 'LanguageSwitcher',
    data() {
      return {
        selectedLanguage: 'ru', // Устанавливаем значение по умолчанию
        languages: [
          { code: 'ru', name: 'Русский (Оригинал)' },
          { code: 'en', name: 'English' }
        ],
        googleTranslateLoaded: false
      }
    },
    mounted() {
      // Проверяем сохраненный язык при монтировании
      const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
      this.selectedLanguage = savedLang;
      
      if (savedLang === 'en') {
        this.loadGoogleTranslate();
      }
    },
    methods: {
      loadGoogleTranslate() {
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            new google.translate.TranslateElement(
              {
                pageLanguage: 'ru',
                includedLanguages: 'en',
                autoDisplay: false
              },
              'google_translate_element'
            );
            this.googleTranslateLoaded = true;
          }
        };
  
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      },
  
      removeGoogleTranslate() {
        const elements = document.querySelectorAll([
          '.goog-te-banner-frame',
          '.goog-te-menu-frame',
          '.VIpgJd-ZVi9od-l4eHX-hSRGPd',
          '.goog-te-gadget',
          '.skiptranslate'
        ].join(','));
        
        elements.forEach(el => el.parentNode?.removeChild(el));
  
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
  
        document.body.style.top = 'auto';
        document.body.classList.remove('translated-ltr');
        document.documentElement.classList.remove('translated-ltr');
  
        const scripts = document.querySelectorAll('script[src*="translate.google"]');
        scripts.forEach(script => script.parentNode?.removeChild(script));
  
        this.googleTranslateLoaded = false;
      },
  
      handleLanguageChange(value) {
        // Сохраняем выбранный язык
        localStorage.setItem('selectedLanguage', value);
        
        if (value === 'ru') {
          this.removeGoogleTranslate();
          window.location.reload();
        } else {
          if (!this.googleTranslateLoaded) {
            this.loadGoogleTranslate();
          }
          
          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
              selectElement.value = 'en';
              selectElement.dispatchEvent(new Event('change'));
            }
          }, 1000);
        }
      }
    }
  }
  </script>
  
  
<style scoped>
.language-switcher {
  width: 90%;
  margin: 25px auto;
  position: relative;
}

.language-select {
  width: 100%;
  transition: all 0.3s ease;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.language-flag {
  font-size: 20px;
}

.language-name {
  font-size: 15px;
  font-weight: 500;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 12px;
  height: 50px;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  box-shadow: 5px 5px 10px #d9d9d9,
              -5px -5px 10px #ffffff;
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-select .el-input__wrapper:hover) {
  transform: translateY(-1px);
  box-shadow: 6px 6px 12px #d9d9d9,
              -6px -6px 12px #ffffff;
}

:deep(.el-select .el-input__inner) {
  height: 50px;
  font-size: 15px;
  font-weight: 500;
}

:deep(.el-select-dropdown__item) {
  padding: 8px 20px;
}

:deep(.el-select-dropdown__item.selected) {
  background-color: #f0f7ff;
  color: #409eff;
  font-weight: 600;
}

:deep(.el-select-dropdown__item:hover) {
  background-color: #f5f7fa;
}

#google_translate_element {
  display: none;
}

/* Dark theme support */
:deep(html.dark) .el-select .el-input__wrapper {
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  box-shadow: 5px 5px 10px #151515,
              -5px -5px 10px #2f2f2f;
}

:deep(html.dark) .el-select .el-input__wrapper:hover {
  box-shadow: 6px 6px 12px #151515,
              -6px -6px 12px #2f2f2f;
}

:deep(html.dark) .el-select-dropdown__item.selected {
  background-color: #1a1a1a;
  color: #409eff;
}

:deep(html.dark) .el-select-dropdown__item:hover {
  background-color: #2a2a2a;
}

@media (max-width: 580px) {
  .language-switcher {
    width: 95%;
    margin: 25px 10px;
  }

  :deep(.el-select .el-input__wrapper) {
    height: 45px;
  }

  :deep(.el-select .el-input__inner) {
    height: 45px;
    font-size: 14px;
  }

  .language-flag {
    font-size: 18px;
  }

  .language-name {
    font-size: 14px;
  }
}
</style>
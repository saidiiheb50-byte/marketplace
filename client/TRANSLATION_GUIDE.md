# Translation Guide - French & English

## ✅ What's Already Done

- ✅ i18n configuration set up
- ✅ Translation files created (English & French)
- ✅ Language switcher component created
- ✅ Navbar updated with translations
- ✅ Home page updated with translations

## 📦 Installation

First, install the dependencies:

```bash
cd client
npm install
```

## 🔄 How to Use Translations in Components

### Step 1: Import useTranslation

```jsx
import { useTranslation } from 'react-i18next';
```

### Step 2: Get the translation function

```jsx
const { t } = useTranslation();
```

### Step 3: Use translations

```jsx
// Simple translation
<h1>{t('home.title')}</h1>

// With variables (if needed)
<p>{t('welcome', { name: user.name })}</p>
```

## 📝 Example: Updating a Component

**Before:**
```jsx
const Products = () => {
  return (
    <div>
      <h1>Browse Products</h1>
      <input placeholder="Search products..." />
    </div>
  );
};
```

**After:**
```jsx
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('products.title')}</h1>
      <input placeholder={t('products.searchPlaceholder')} />
    </div>
  );
};
```

## 🌐 Language Switcher

The language switcher is already added to the Navbar. Users can:
- Click the globe icon 🌐
- Select English 🇬🇧 or Français 🇫🇷
- Language preference is saved in localStorage

## 📚 Available Translation Keys

All translation keys are in:
- `client/src/i18n/locales/en.json` (English)
- `client/src/i18n/locales/fr.json` (French)

### Main Sections:
- `nav.*` - Navigation items
- `home.*` - Home page
- `products.*` - Products page
- `productDetail.*` - Product detail page
- `cart.*` - Shopping cart
- `checkout.*` - Checkout page
- `orders.*` - Orders page
- `wishlist.*` - Wishlist page
- `messages.*` - Messages page
- `auth.*` - Login/Register pages
- `createProduct.*` - Create product page
- `common.*` - Common words (loading, error, etc.)

## 🔧 Adding New Translations

1. Add the key to both `en.json` and `fr.json`:

**en.json:**
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

**fr.json:**
```json
{
  "mySection": {
    "myKey": "Mon texte français"
  }
}
```

2. Use it in your component:
```jsx
{t('mySection.myKey')}
```

## 🚀 Next Steps

To complete the translation, update these pages:
- Products.jsx
- ProductDetail.jsx
- Cart.jsx
- Checkout.jsx
- Orders.jsx
- OrderDetail.jsx
- Wishlist.jsx
- Messages.jsx
- Login.jsx
- Register.jsx
- CreateProduct.jsx
- EditProduct.jsx

All translation keys are already available in the JSON files!




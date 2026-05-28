# 💌 love-attention

*an extension to recover focus and delay instant gratification.*

> "don't you think maybe they are the same thing? love and attention?"
> — Lady Bird

inspired by convos with my friends & the [forest app](https://www.forestapp.cc/)

---

### how it works

set a timer, start your session. if you finish without abandoning it, you receive a letter — a small note to yourself. your letters collect in a notebook you can open anytime.

while a session is running, any site on your blocklist redirects to an interstitial instead of loading. an allowlist lets you carve out exceptions.

---

### screenshots

<table>
  <tr>
    <td><img width="440" alt="home" src="https://github.com/user-attachments/assets/9c47e0c6-2edb-426f-bd5c-3f7d4e223536" /></td>
    <td><img width="440" alt="session" src="https://github.com/user-attachments/assets/2002f74d-825e-4ff4-b655-0c7136fc061d" /></td>
  </tr>
  <tr>
    <td><img width="440" alt="quote" src="https://github.com/user-attachments/assets/114703ee-d02f-4b12-8ff1-6268625e73e6" /></td>
    <td><img width="440" alt="notebook" src="https://github.com/user-attachments/assets/65bc1cf4-3f17-4cef-93c8-ee7cc5fb1512" /></td>
  </tr>
  <tr>
    <td><img width="440" alt="settings" src="https://github.com/user-attachments/assets/4371e542-accb-4137-9847-8db5af11b35a" /></td>
    <td><img width="440" alt="blocked — upon navigating to instagram.com" src="https://github.com/user-attachments/assets/6354bc6b-cb76-45f4-b543-ccbfeeaaddac" /></td>
  </tr>
</table>

---

### install

1. clone or download this repo
2. open `chrome://extensions`
3. enable **developer mode** (top right)
4. click **load unpacked** and select the folder

---

### permissions used

| permission | why |
|---|---|
| `storage` | save letters, session state, and your blocklist |
| `alarms` | complete the timer even when the popup is closed |
| `notifications` | notify you when a session finishes |
| `webNavigation` | detect navigation to blocked sites |
| `tabs` | redirect blocked tabs to the interstitial |

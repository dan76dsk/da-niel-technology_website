---
title: "End-to-End 3D Printing Order Platform"
excerpt: "I designed and implemented a custom 3D printing order platform that replaced manual quotations and email handling with full self-service: from price calculation to payment and fulfillment notifications."
tech: ["React", "Node.js", "Python", "JWT", "AWS S3 / MinIO", "PrusaSlicer CLI", "Blender CLI", "MySQL", "WordPress"]
---

# Description

3D printing order platform - from model upload to online payment - in less than a minute, completely self-service. From business problem to production deployment.

I created a full-stack automated 3D printing quotation system for Geometry Hustlers that replaced manual operator calculations and all email-based "file exchanges" with a single, unified online process. From the browser, the client uploads a 3D model, selects material and parameters, and the application performs real slicing in seconds, calculates the cost, and displays the lead time. Order placement occurs without human intervention on the company side.

From a business perspective, this means reducing response time from several hours to 30 seconds, reducing work on quotations to practically zero, and increasing inquiry conversion by several percentage points. The system maintains margins, eliminates pricing errors (0% discrepancies between quotation and actual cost), and scales with the number of inquiries instead of blocking sales with the availability of a few people. This is an example of a project where technology (Node.js, React, PrusaSlicer, payment integration) is just a means - the goal was to streamline the sales process and unlock company growth.

The 3D printing order platform is a complete automated 3D printing quotation system that:

- Gives the client **instant quotation**
- Allows the client to **experiment with configuration** in real-time
- Shows **precise lead time** taking into account the order queue
- **Eliminates email correspondence** - entire process from quotation to online payment
- **Guarantees price accuracy** - calculations based on real slicing

![example_part_configuration](/images/projects/automated-quotation-system/przykladowa_konfiguracja_czesci.jpg "Example part configuration")

## Features

The system appears from the outside as a simple and convenient online quotation tool, but underneath it connects the entire process: from file upload to paid order with complete files in the admin panel.

**Key features:**

- **Instant 3D printing quotation**
  - STL/STEP file upload, part production configuration (material, color, infill, quantity)
  - price and lead time update in real-time.

- **Real slicing in the background**
  - backend runs PrusaSlicer CLI and calculates price based on actual filament consumption and printing time

- **Complete online order process**
  - cart summary, delivery selection, online payments (Przelewy24)
  - automatic confirmations and order status emails

- **User account and cross-device work**
  - registration/login, order and invoice history
  - ability to continue quotation on another device
  - automatic quotation assignment to account after registration/login

- **Admin panel for the company**
  - order management (status changes, detail viewing and file downloads)
  - automatic email sending with status change info
  - automatic invoice generation

## Business approach to the solution

Before I started work on the platform, I examined how the entire customer service process looked in practice: from the first email from the client with a quotation request, through manual model entry into the slicer, to replying with an offer and explaining differences between variants.

**It quickly turned out that most of the company's energy goes into handling quotations and educating clients**, not the printing itself, and each additional request for a different infill or material quote means more minutes someone has to spend. At the same time, clients had to wait to learn the price, so part of the leads simply disappeared in the meantime. **It was clearly visible that almost this entire process can be automated** - so that the client independently experiments with configuration and immediately sees the price.

**The two key problems I wanted to solve were:**

- **Inefficient use of specialist time**
  Tthe person pricing client inquiries spent several hours a day manually importing models into the slicer, calculating material consumption, and transcribing quotations into emails - repetitive work that doesn't create real value (except for rapid response to client needs).

- **Lack of process scalability**
  More inquiries = proportionally more work for operators. Sales were limited by people's throughput, not machines.

Based on this, I defined **specific project goals and assumptions**:

- maximize shortening the time from inquiry to quotation,
- limit and automate repetitive work on quotations and client education. The process should be **fully self-service for the client** - from file upload to online payment,
- design an architecture that scales with the number of inquiries without the need to hire more people for quotations,
- minimize pricing errors by relying on real slicing. The system must calculate prices based on real G-code from the Slicer, not just volume,
- organize the process from quotation to fulfillment so that every model, file, and status has its place in the system,
- integrate the solution into the existing WordPress ecosystem, instead of building a separate, isolated entity,

The solution must be **custom**, because ready-made e-commerce plugins don't understand the 3D printing domain (each 3D file configuration = separate product). All further technical architecture - Node.js, React, PrusaSlicer, S3/MinIO, admin panel - was just a consequence of these business decisions.

# How it works in practice (client and administration)

From the user's point of view, it's simply a tool that allows you to "drop a file and immediately learn the price", and from the company's point of view - one place where all quotations, orders, and files land. All the complex logic of the slicer, pricing algorithms, and integrations is hidden behind a simple, linear flow: the client enters the site, uploads a model, configures the print, pays for the order, and the administrator sees a ready order with complete data.

## Order process

The process for the client was designed to resemble a classic shopping cart - except instead of choosing a ready product from a list, the user "creates" a product by uploading their own 3D model and selecting print parameters.

### File/s upload

The client goes to the quotation subpage https://geometryhustlers.pl/quote/ (e.g., from the main menu or call-to-action on the page) and immediately sees a panel for uploading files and a brief description of what will happen: "upload model, select parameters, learn price". The user can drag STL/STEP files onto the dropzone or select them from disk - individually or several at once, without the need to log in.

![configurator_homepage](/images/projects/automated-quotation-system/strona_glowna_konfiguratora.jpg "Configurator homepage with dropzone for 3D file upload")

Even before sending files, the application verifies basic parameters: format, file size, and model dimensions. File size limit depends on user type - guest has a lower threshold, logged-in user can upload larger models.

If an unlogged user uploads a file larger than the applicable guest limit, they will be presented with a pop-up encouraging them to create an account to upload larger files

![guest_upload_limit](/images/projects/automated-quotation-system/upload_limit_goscia.jpg "Pop-up encouraging registration to upload larger files")

If the file passes initial validation, upload and processing begins.

![file_processing_upload](/images/projects/automated-quotation-system/upload_przetwarzanie_plikow.jpg "3D file upload processing")

After successful upload, each file becomes a separate item in the configurator - with name, 3D model thumbnail, and basic parameters. In the background, the pricing engine is launched, which based on default settings (FDM technology, PLA material, black color, 20% infill) calculates printing time and cost. As long as a given item is in the quotation calculation state, its settings are temporarily locked - the user sees a "calculating..." message.

![item_during_calculation](/images/projects/automated-quotation-system/pozycja_w_trakcie_obliczania.jpg "Waiting for price calculation by pricing server")

If at the geometry verification stage the system detects that the model exceeds the allowable printer dimensions, the client will immediately see a clear message about exceeded dimensions and an indication of which axes require model reduction.

![oversized](/images/projects/automated-quotation-system/oversized.jpg "System response to exceeded part dimensions")

After a few seconds (depending on model complexity), the quotation is ready, the item unlocks for further configuration, and the button to proceed to summary becomes available.

After the first correct upload and item creation, the client can add more files at any time - they will be added as new items to the same quotation session and go through exactly the same processing process.

When the first quoted item appears in the configurator, the system displays a tile with order summary with automatically calculated lead time, list of elements, and a "place order" button redirecting to the summary page. Only items with models that don't exceed dimensions or have other processing errors are added to the summary list.

The pricing system has implemented a minimum order amount to avoid overloading the system with very small orders. If configurator elements don't exceed it, it will be applied in the summary with appropriate information for the user.

![configurator_one_item](/images/projects/automated-quotation-system/konfigurator_jedna_pozycja.jpg "Configurator appearance with one quoted item")

### Quotation configuration

Quotation configuration can be started by pressing the "customize configuration" button. Then additional options expand under the quoted item, containing a configurator with an infobox serving as a user guide.

![configured_item](/images/projects/automated-quotation-system/konfigurowana_pozycja.jpg "Appearance of configured item with user information")

**Quantity**

In the configurator, you can enter the number of pieces (quantity) for each model separately. The system automatically recalculates the final price depending on the selected volume. The larger the quantity, the lower the unit print price - the discount is calculated algorithmically, and the resulting cost of one piece and the item sum is visible in real-time with each quantity change. Thanks to this, the client can easily check how increasing the ordered number of parts affects the order price.

![quantity_impact_on_price](/images/projects/automated-quotation-system/wplyw_nakladu_na_cene.jpg "Impact of quantity on price")

**Configurator**

In the current version of the configurator, the user has the ability to select such production parameters as:

- 3D printing technology
- Material (plastic)
- Material color (depending on current availability)
- Infill (for FDM technology)
- Advanced options - available for logged-in users

![configurator_options](/images/projects/automated-quotation-system/opcje_konfiguratora.jpg "Available configuration options")

Currently, one advanced option is implemented - "3D printing without supports", which is only available for logged-in users (for guests it's "grayed out" and non-clickable). The option is available when the algorithm detects that the 3D model was sliced with supports. The option is useful when the person ordering the 3D print has basic knowledge of FDM 3D printing and is sure that the sent part can be made without support material - this affects the final part price and lead time. Selecting this option requires confirmation, a warning pop-up will appear:

![print_without_supports](/images/projects/automated-quotation-system/druk_bez_podpor.jpg "Pop-up for selected print without supports option")

The fact of consent is recorded in the database with the date of pop-up content confirmation.

**User guide - infobox**

When hovering the cursor over each configurator option, the infobox content changes. It presents the user with basic information about the selected item (e.g., durability, price class, tolerances) and a preview graphic.

![infobox_material_asa_cf](/images/projects/automated-quotation-system/infobox_material_asa_cf.jpg "Example of material information")

![infobox_infill_40](/images/projects/automated-quotation-system/infobox_wypelnienie_40.jpg "Example of infill information")

If the user needs to learn more about a given option, the infobox in the upper right corner contains a link to a page thoroughly describing the given option (e.g., page with a specific material)

### Proceeding to summary

As I mentioned in the "file upload" section, proceeding to summary is possible if there is at least one correctly quoted item (without processing errors) in the 3D printing quotation calculator.

The summary tile:
- contains a list with a summary of all quoted items,
- on the right side displays the expected lead time calculated by the system,
- has a "display gross prices" checkbox (facilitating cost estimation for both individuals and companies).

![summary_div](/images/projects/automated-quotation-system/podsumowanie_div.jpg "Summary tile")

The "display gross prices" checkbox is checked by default and gross prices are displayed - both in each item and in the summary. Analogously - if it's unchecked, net prices are displayed with adequate VAT rate information.

![net_gross_handling](/images/projects/automated-quotation-system/obsluga_netto_brutto.jpg "Presentation of display gross prices checkbox operation")

After clicking "place order" we assume two behaviors:
- for a logged-in user, redirection to the summary page occurs,
- for a guest, before redirection occurs, a pop-up is presented encouraging account creation - it can be skipped by clicking "continue as guest".

![order_modal](/images/projects/automated-quotation-system/modal_zamowienie.jpg "Pop-up shown to unlogged users")

After proceeding to the summary page (https://geometryhustlers.pl/quote/order/) 4 sections + summary are visible:
- Ordered parts - list with summary of ordered parts, their configuration and lead time,
- Shipping data - guests must complete each time, and for logged-in users data is retrieved from the database. After checking the "I want a company invoice" checkbox, the form will expand with company data fields
- Delivery - delivery method selection
- Payment - payment method selection
- Summary - calculation of all costs broken down into parts sum, delivery and VAT; "display gross prices" checkbox, checkboxes with terms and privacy policy acceptance and "proceed to payment" button

The "display gross prices" checkbox behaves exactly the same as in the configurator - it transforms net<->gross prices and changes messages to adequate ones (whether the displayed amount includes VAT or not).

![summary_page](/images/projects/automated-quotation-system/strona_podsumowania.jpg "Summary page appearance")

**Shipping data & differences between guest and logged-in user**

A logged-in user at this stage will have their shipping data and (if completed) company invoice data retrieved from the database, and information that order fulfillment requires terms acceptance. Checkboxes are not displayed again - consent was already expressed during registration and is saved in the system.

![summary_user_view](/images/projects/automated-quotation-system/podsumowanie_widok_uzytkownika.jpg "What a logged-in user sees")

An unlogged user at this stage sees an empty form to complete and checkboxes requiring confirmation of familiarity with terms and privacy policy before proceeding to payment.
Expressing these consents is not just a formality - when placing an order, the system records each acceptance, saving information about consent expression along with date and time to the specific order record in the database. Thanks to this, each consent can be easily identified and linked to a specific transaction, which is necessary for GDPR compliance and for legal security of the sales process.

![summary_guest_view](/images/projects/automated-quotation-system/podsumowanie_widok_goscia.jpg "What an unlogged user - guest sees")

**Delivery method selection**

To choose from:
- InPost Courier
- InPost Parcel Locker

After selecting InPost parcel locker, a "select parcel locker" button appears.

![delivery_selected_locker](/images/projects/automated-quotation-system/dostawa_wybrany_paczkomat.jpg "Selected InPost Parcel Locker in delivery method")

You need to select a parcel locker/parcel point from the InPost map (click "Select parcel locker" > parcel locker map will display)

![inpost_map](/images/projects/automated-quotation-system/mapa_inpost.jpg "InPost map")

After selecting a parcel locker, information about the selected parcel locker will display:

![selected_locker_summary](/images/projects/automated-quotation-system/wybrany_paczkomat_podsumowanie.jpg "Information about selected parcel locker")

**Payment method selection**

Payments are handled by Przelewy24.
To choose from:
- Fast transfer
- BLIK

Both payment methods redirect to the przelewy24 page. The "fast transfer" method allows selecting your bank or other payment method from the list of online payments. BLIK requires entering a BLIK code on the przelewy24 page, to which redirection will occur after clicking "proceed to payment".

**Proceed to payment**
The "proceed to payment" button is active (clickable) only when all form fields are correctly completed.

### Payment and confirmation

After clicking "proceed to payment", redirection to the Przelewy24 payment operator page occurs, where you need to pay for the order.

![p24_payment.jpg](/images/projects/automated-quotation-system/platnosc_p24.jpg "Payment in Przelewy24 system")

After successful payment completion, return to the https://geometryhustlers.pl/order-success/ page occurs, where payment status is displayed.

While reading payment status from the database, a status checking message displays for a moment:

![payment_checking_status](/images/projects/automated-quotation-system/platnosc_sprawdzanie_statusu.jpg "Checking payment status")

There are 3 payment statuses: Pending, paid, and error

![payment_processing](/images/projects/automated-quotation-system/przetwarzanie_platnosci.jpg "Payment processing message")

![payment_success](/images/projects/automated-quotation-system/platnosc_sukces.jpg "Successful payment message")

![payment_problem](/images/projects/automated-quotation-system/platnosc_problem.jpg "Payment problem message")

### Email notifications and order statuses

After successfully completed payment, the fulfillment enters the system with the status "awaiting technical verification" to verify whether the part is even feasible. The client receives an email with payment acceptance confirmation and order summary

![email_after_order](/images/projects/automated-quotation-system/email_po_zamowieniu.jpg "E-mail after paying for order")

If the client was a registered user, in the user panel a position with the status "paid - technical verification" will be visible:

![order_in_panel](/images/projects/automated-quotation-system/zamowienie_w_panelu.jpg "View of paid order in panel")

After verification and acceptance by the administrator of the order, the order status changes to "in fulfillment" informing the client by email about the status change.
Emails to the client are sent after status changes:
- "paid - technical verification" -> "in fulfillment"
- "in fulfillment" -> "fulfilled"

## User account

The user account system is based on WordPress's native mechanism - it uses the existing user table and authorization logic, and the quotation application communicates with it through its own API.

### Registration and account confirmation

During the registration process (on the https://geometryhustlers.pl/register page), the user is required to provide first and last name, email address and password (optionally also address data). Registration also requires accepting the Terms and Privacy Policy by checking the appropriate checkboxes. Expressed consents are not just a technical condition of registration - this information is permanently saved in the database, each consent is assigned to a specific user, and the system also records the date and time of their expression. Thanks to this, each acceptance of terms and privacy policy can be unambiguously confirmed if necessary, which ensures compliance with GDPR requirements and other regulations regarding personal data processing.

After correct completion and submission of the form, the user receives a message:

![account_created](/images/projects/automated-quotation-system/konto_utworzone.jpg "Message after account registration")

The system creates an account and sends an activation link to email. After clicking the activation link, the account becomes active and the user will be redirected to the login page with an activated account message:

![account_activated](/images/projects/automated-quotation-system/konto_aktywowane.jpg "Message after account activation")

### Login

Login is classic - email + password. After correct login, the user is automatically "connected" to an existing active quotation session loaded from the database (or the session is transferred if before login, in the browser session, they were acting as a guest), so as not to lose previously entered 3D models and configurations. In case of incorrect password, the system returns a clear message, and access recovery occurs by sending a password reset link to the provided email address.

Login occurs in three places:
- main login page at https://geometryhustlers.pl/login,
- pop-up that appears to guests when attempting to upload a file larger than the applicable limit for guests,
- pop-up that appears to guests when proceeding to summary.

![login](/images/projects/automated-quotation-system/logowanie.jpg "Main login page")

Only users who have activated their account can log in. When attempting to log in to an inactive account, the user will get a message:

![account_not_activated](/images/projects/automated-quotation-system/konto_nieaktywowane.jpg "Message about inactive account")

After login, the user is redirected to the user panel, and in the page header their username will be displayed:

![logged_in_user](/images/projects/automated-quotation-system/zalogowany_uzytkownik.jpg "Appearance of header fragment for logged-in user")

### Password reset

On the login page, clicking "forgot password" redirects to the reset link sending page at https://geometryhustlers.pl/forgotpass.

![reset_password](/images/projects/automated-quotation-system/resetuj_haslo.jpg "Password reset form")

After entering the email associated with the account for which the password reset applies, the user receives a message:

![password_reset](/images/projects/automated-quotation-system/reset_hasla.jpg "Message about sent password reset link")

After clicking the password reset link, redirection to WordPress password reset occurs:

![wordpress_password_reset](/images/projects/automated-quotation-system/wordpressowe_resetowanie_hasla.jpg "Setting new password")

After setting a new password, the user receives a confirmation message:

![password_changed](/images/projects/automated-quotation-system/haslo_zmienione.jpg "Message confirming changed password")

### User panel and order history

After login, the user has access to a simple panel where they see a list of their orders with key information: date, amount, status, and number of models in the order. The user panel is available at https://geometryhustlers.pl/account/. The main page of the user panel is the orders tab.

![my_orders](/images/projects/automated-quotation-system/moje_zamowienia.jpg "User's order list")

In the orders tab, you can review current and archived orders. Each order position gives the ability to download the VAT invoice for the order (by clicking the invoice icon in the "invoice" column) and see order details by clicking the order number

![order_details_user_account](/images/projects/automated-quotation-system/szczegoly_zamowienia_konto_uzytkownika.jpg "Details of selected order")

In addition to order history, the user panel has an account management option (https://geometryhustlers.pl/account/manage) where you can:
- change your data
- change password
- delete account

![account_manage](/images/projects/automated-quotation-system/account_manage.jpg "User panel - account management")

- After clicking "change data", a form appears where data can be updated.
- After clicking "change password", a password reset link is sent to the user's email address and a message appears:

![message_change_password](/images/projects/automated-quotation-system/komunikat_zmien_haslo.jpg "Message after password change")

To protect against mass sending of emails sending password change links, a security mechanism was added. After clicking again, the user gets a message to wait a few seconds before resending the email:

![message_change_password_wait](/images/projects/automated-quotation-system/komunikat_zmien_haslo_poczekaj.jpg "Message after clicking change password too quickly")

After clicking "delete account", the user is informed via pop-up that with this operation, all data associated with the account will be permanently deleted from IT systems:

![modal_delete_account](/images/projects/automated-quotation-system/modal_usun_konto.jpg "Pop-up warning before account deletion")

### Quotation continuation between devices and session validity period

By default, a guest's quotation is assigned to the browser session - you can close the tab and return later on the same device without data loss. A guest session is valid for 7 days.

If the user registers or logs in at any time, the existing session is assigned to their account and the validity period is extended to 30 days. Thanks to this, they can start a quotation on one device and finish it on another, seeing exactly the same models and configurations.

## Admin panel

The admin panel is the operational center of the platform, which enables the Geometry Hustlers team to efficiently manage all stages of order handling - from verification of new orders, through production status control, to organizing and archiving 3D files. The panel was designed primarily with functionality in mind - the interface is minimalist and focused on operator speed and work comfort, not on visual effects. The whole is constructed to facilitate daily work and allow lightning-fast execution of the most important administrative operations.

### Quotation session management

This is a tool for controlling and monitoring all started and archived (but not yet deleted) quotation sessions - both from guests and registered users. It allows the operator to track the entire quotation process and take appropriate actions at the stage before order.

**Quotation session table**

The summary table presents key information about each session: session ID, user, status (active/expired), creation dates, last activity and planned expiration, total quotation value and expected lead time. Sorting and filtering by any column is possible - e.g., finding the newest or highest valued offers.

![admin_panel_quotation_sessions](/images/projects/automated-quotation-system/admin_panel_sesje_wyceny.jpg "Quotation session table")

From the list level, the administrator can:
- delete single or group sessions (e.g., expired, test, erroneously generated),
- monitor the quotation path - which were transformed into orders and which abandoned or unfinished,
- for sessions associated with a user account, trigger a "follow-up" action that will send a reminder email with a return link to complete the quotation.

**Quotation session details**

After clicking the ID or "details" button, a modal with complete summary is available: list of uploaded models, selected print parameters (material, color, infill, quantity), processing statuses of each item, and lead time for the entire session.

![quotation_session_details](/images/projects/automated-quotation-system/szczegoly_sesji_wyceny.jpg "Quotation session details")

**Email reminders about quotation (follow-up)**

When a quotation session is associated with a user account, the operator can with one click send an automatic reminder email about a left - but unfinished - offer. The message contains an individual link to the session, which allows returning without losing configuration.

![quotation_reminder](/images/projects/automated-quotation-system/przypomnienie_o_wycenie.jpg "Email content reminding about quotation")

### Order management

This is a key functionality of the admin panel. In the order management module, a list of all orders placed by users is visible - both new, being fulfilled, and already completed. Thanks to flexible order management, operators can easily track production progress, respond to emerging inquiries, and maintain exemplary order in the order archive - without the need to reach for external tools or dig in the database.

The module was designed so that as many administrative activities as possible take place from one view - without page reloading and without the need to use additional forms or external systems. Most repetitive tasks (status change, notification sending, document generation) are performed automatically or with one click.

**Order table**

Order information is presented in the form of a transparent table. The table presents such data as: order ID, user, net value, current status (e.g., new, paid, in fulfillment, shipped, canceled), creation date, expected lead time, and information about any attached note from the client. The last column is for actions available to the operator.

![admin_panel_orders](/images/projects/automated-quotation-system/admin_panel_zamowienia.jpg "Order table")

The order table enables filtering and sorting by any fields (status, date, user, value), which allows quickly finding the interesting order or identifying production priorities.

**Additional options for selected orders**

The first column of the order table contains checkboxes enabling selection of single or multiple positions simultaneously. When at least one position is selected, an additional bar with mass operation options appears above the table:

- Copy files - transfers 3D model files of selected orders from the indicated quotation folder to a dedicated production folder on S3. This prevents file loss in case of automatic quotation session cleaning and ensures production archive stability.
- Download logs - allows downloading diagnostic backend logs related to the selected order configuration. This function helps in quick diagnosis and solving any technical problems reported by the client (e.g., unusual slicer behavior, configuration discrepancies, upload errors).
- Delete selected - enables permanent deletion of selected orders from the system, along with related files and data.

![admin_panel_additional_order_options](/images/projects/automated-quotation-system/admin_panel_dodatkowe_opcje_zamowien.jpg "Additional options for selected orders")

**Order details**

After entering order details, the operator gains access to all key information about a given fulfillment in one place. For each item, detailed production configuration is presented - material, color, infill, special options and number of pieces - supplemented with 3D model preview and the ability to download the original 3D file. In addition, operational information is displayed for each part: expected printing time and material consumption, being the precise result of slicer analysis. Thanks to this, the operator has all data necessary for efficient organization and planning of the production process.

![admin_panel_order_details](/images/projects/automated-quotation-system/admin_panel_szczegoly_zamowienia.jpg "Order details")

In addition, order details contain full contact data of the orderer and shipping data, which allows immediate package preparation or contact in case of ambiguities. The whole was designed so that order handling - from file verification, through production, to shipping - is possible without leaving the admin panel.

**Operator actions**

All key actions are available contextually, depending on the order stage. Thanks to this, the panel guides the operator through the process step by step, not allowing e.g., closing fulfillment before generating documents or completing shipping data. Automatic email notifications relieve the operator in contact with the client and minimize the risk of information errors.

- **For the status "paid - technical verification", the available action is "approve fulfillment"**

![admin_panel_paid_status](/images/projects/automated-quotation-system/admin_panel_status_oplacone.jpg "Actions for paid order")

After clicking "approve fulfillment", an action confirmation alert pops up:

![admin_panel_fulfillment_approval](/images/projects/automated-quotation-system/admin_panel_zatwierdzanie_realizacji.jpg "Fulfillment approval alert")

After approval, the order status automatically changes to "In fulfillment", and an email is sent to the client confirming that their 3D files have been approved for production.

![approval_email](/images/projects/automated-quotation-system/email_zatwierdzenie.jpg "Email that the client receives after file approval")

- **For the "In progress" status, three actions are available: "Add invoice", "Send package", and "Complete order"**

![admin_panel_status_wrealizacji](/images/projects/automated-quotation-system/admin_panel_status_wrealizacji.jpg "Actions for an order in progress")

After clicking "add invoice", a modal window for adding an invoice to the order will appear.

![admin_panel_dodaj_fakture](/images/projects/automated-quotation-system/admin_panel_dodaj_fakture.jpg "Modal with options for adding an invoice to the order")

In the modal, there are two options available – "Generate invoice automatically" or "Add an invoice link from Fakturownia". By default, the preferred option is to automatically generate the invoice via the invoice system's API – the panel automatically retrieves the client's data and the invoice details from the order, eliminating the need for manual data entry. After the invoice is created, the client will be able to download it from their account panel.

After successfully generating the invoice using the first option, a confirmation will appear:

![admin_panel_potwierdzenie_generowania_faktury](/images/projects/automated-quotation-system/admin_panel_potwierdzenie_generowania_faktury.jpg "Invoice generation confirmation")

When an invoice has already been added to the order, opening the modal with the option to add an invoice will display a message at the bottom indicating the invoice has already been assigned to the order.

![admin_panel_faktura_dodana](/images/projects/automated-quotation-system/admin_panel_faktura_dodana.jpg "Information that the invoice has already been added to the order")

After clicking "Send package", a modal window will appear to add the shipment number to the order. At this stage, you must already have the number of a prepared shipment. For the purpose of the application’s MVP, this functionality suffices, but in the next version of the admin panel, I plan to add automatic waybill generation (automatic waybill creation via the courier company's API, based on the entered package data, along with auto-filling of the waybill number).

![admin_panel_nadaj_paczke.jpg](/images/projects/automated-quotation-system/admin_panel_nadaj_paczke.jpg "Modal with the option to add a shipment number")

After adding the shipment number, a confirmation will appear:
![admin_panel_paczka_nr_przesylki_nadany.jpg](/images/projects/automated-quotation-system/admin_panel_paczka_nr_przesylki_nadany.jpg "Confirmation of saving the shipment number to the database")

When the shipment number has already been added to the order, opening the modal for filling in the waybill will display a message at the bottom stating the shipment number is already assigned to the order.

![admin_panel_potwierdzony_nr_przesylki](/images/projects/automated-quotation-system/admin_panel_potwierdzony_nr_przesylki.jpg "Information that the shipment number has already been assigned to the order")

In order to click the "Complete order" action, it is necessary to first add both the invoice and the shipment number. If either of these items is missing, an appropriate message will appear:

![admin_panel_alert_przez_zakonczeniem](/images/projects/automated-quotation-system/admin_panel_alert_przez_zakonczeniem.jpg "Alert before completing the order")

When both the invoice and shipment number have been added, before executing the action to complete the order, a "Are you sure?" alert will be displayed:

![admin_panel_zakoncz_realizacje](/images/projects/automated-quotation-system/admin_panel_zakoncz_realizacje.jpg "Alert – are you sure you want to complete the order?")

Once the action is confirmed, it will be processed, the order status will change to "Completed", and the client will receive an email notification about the completion of the order, including a link to track their package and the invoice for the completed service.

![admin_panel_potwierdzenie_zakonczenia.jpg](/images/projects/automated-quotation-system/admin_panel_potwierdzenie_zakonczenia.jpg "Order completion confirmation")

![email_zamowienie_zrealizowane](/images/projects/automated-quotation-system/email_zamowienie_zrealizowane.jpg "Email notification about order completion")

### Order in Files and Statuses

To maintain order on the platform and optimize disk space usage, the admin panel is equipped with dedicated tools for managing files, session statuses, and order statuses. In the central area of the management view, there are three key buttons:

- **Clear Expired Sessions** — Removes all information and files associated with expired quotation sessions, both from S3 and the application server. As a result, unnecessary and abandoned quotations don’t take up space or leave behind "junk" files.

- **Check Expiry Dates** — Automatically verifies current sessions and marks those that have exceeded their validity period as "expired". Reviewing and manually triggering this operation allows for quick supervision of the system’s state, especially with a large volume of users.

- **Clear Old 3D Order Files** — Removes 3D files from working directories in S3 that have been moved to the dedicated order archive. Thanks to this, temporary storage used for quotation calculations doesn’t get filled with historical data whose copies are already safely archived with the order.

![panel_porządek](/images/projects/automated-quotation-system/panel_porzadek.jpg "Control panel for file and status order")

Each of these operations notifies the operator of its outcome — after completing a task, the system returns operation details from the backend (e.g., the number of deleted files), which are displayed directly in the panel. This allows the administrator to easily monitor and confirm the current state of the platform and the effectiveness of maintenance actions.

![wynik_operacji_porządkowej](/images/projects/automated-quotation-system/wynik_operacji_porządkowej.jpg "Example of the result of a maintenance operation")

Thanks to this, files uploaded as part of quotations are stored only for the minimum time required to fulfill the order—the rest are automatically and irreversibly deleted. This approach ensures genuine GDPR compliance and a high standard of security.

---

# Technical Summary and Implementation Experience

## From Scratch to a Scalable Production Platform - Intentional Project Management

Before writing a single line of code, I thoroughly researched the desired business outcomes for this platform—it wasn’t just about automation, but about the company’s strategic growth: reducing operational workload, eliminating purchasing barriers, scaling up, and eliminating errors in the quotation process. From the very beginning, I approached the project from the perspective of the business, not just as an IT product. I identified repetitive manual tasks and implemented optimizations that turned the printshop into a “machine” that could now be operated from a meta-level: monitored, modularly expanded, and automated. This embodied the principle of “work on the business, not in the business”—with a focus on business effectiveness, not just writing code.

At the same time, I ran the implementation as an “end-to-end project” from the start:
- Mapping out the entire workflow (user, quotation session, order, admin),
- Precise requirement definition (e.g., critically: real, not estimated, quotation prices = slicing the G-code),
- Security, usability, and scalability as non-negotiable requirements (even if it meant extra work on the architecture and DevOps side),
- Treating user experience, future scalability, and security as “must-haves”, impacting both architectural decisions and DevOps best practices.

## Learning by Doing, Tools, and Conscious AI-Assisted Development

When I started the project, I had the basics of JavaScript, but Node.js and React were new to me. My biggest advantage was not knowing the syntax itself, but having a natural technological intuition and the ability to sense the technological context. Key to my success was also proficiency in using AI tools—I never treated LLMs as “autopilots” but as contextual assistants. Their role was never just to mindlessly generate code, but to process intent and project logic, debug, develop the architecture, and improve deployments.

For most tasks, I used two main approaches:

### Working With Claude Sonnet 4.5 and ChatGPT 4.1 (Standard Workflow)

At the beginning of the project, my primary tool was Claude Sonnet 4.5, although I often complemented it with ChatGPT 4.1 in daily work. I established a clear division of tasks between these models:
- **Claude Sonnet 4.5** was my go-to for generating more extensive code blocks—front-end and back-end—as well as for quick iterations, refactoring, and debugging interactions between different components. Before each session with Claude, I always prepared a concise, well-formatted documentation note outlining the project, repository structure, and current scope of changes. As needed, I supplemented these with relevant code snippets (README, key files) so Claude could better understand both the business and technical context.
- **ChatGPT 4.1** I treated as a “precision surgical tool”—I used it for micro-operations, isolated fixes, unit testing, generating tests, or resolving local bugs. The advantage of GPT was the ability to pose very specific problems and get instant corrections.

A key element of my workflow was **context control**:
– Every major feature had its own dedicated conversation—to avoid wasting tokens on irrelevant context,
– I was careful to include only the information necessary for the current feature within any given conversation—no unnecessary noise from other topics,
– Notes, README, and code snippets were provided only as needed and were kept up-to-date as changes occurred,
– Upon completing work on one feature, a new feature meant a new conversation, with a clean and current context.

This approach allowed me to use both models efficiently—Claude Sonnet 4.5 for holistic, multi-stage changes, and ChatGPT 4.1 for precision operations. At every step, I remained the “conductor” of the process—controlling information flow and coding paths, maintaining high quality and saving both time and AI-related costs.

### Breakthrough With Claude Code (GitHub Monorepo Integration)

The real game-changer came when I discovered Claude Code and connected my monorepo project via GitHub. This tool immediately took over the entire context—without the need to repeatedly explain the structure, repo, dependencies, or intentions.

All it required was regular, up-to-date documentation in the README and maintaining project consistency—Claude Code was then able to understand changes cross-modularly and keep track of everything happening on the backend, frontends, and in config files.

The result?
- In a single longer session, I could implement changes affecting the API, admin panel, and backend workflow simultaneously,
- This greatly reduced the need to manually “warm up” the context by copying files,
- Smoother synchronous development (e.g., changes in one component were automatically tracked by corresponding server or frontend code).

In both approaches, the most important thing was that I set the tone, boundaries, and workflow—AI was a tool, not a “black box.” The resulting code was consistent and logical because I led the workflow from start to finish, always understanding the consequences of every change.

I believe that practically any feature can be implemented with AI, provided you prepare the ground correctly and establish clear rules of engagement (one conversation = one feature/process, clean README, strict context)—this gave me a significant productivity boost. It was also invaluable in learning new technologies “on the fly,” such as React, which I had to rapidly adopt to ensure the platform was truly modern and efficient.

## Architecture, Stack, and Technical Decisions – Engineering for Real Requirements, Not Hype

Key decision: the entire stack was to be fully custom—no off-the-shelf solutions that don’t understand the specifics of 3D printing (e.g., WooCommerce, Shopify, generic calculators).

- **Backend:** Node.js (steeper learning curve, but full control)
- **Frontend:** React (comfort of layer separation: I could independently implement, test, and refactor; the UI could be integrated with WordPress)
- **Repository:** GitHub monorepo, 3 main packages (user frontend, admin panel, backend), all versioned, with full change history.

### Key Tool: PrusaSlicer

Implementing quotations based on real G-code—not just volume estimates, but actual data from terminal slicing—changed everything from a business point of view:
- Accurate quotations,
- No underpriced/unpredictable costs (“surprises” familiar from other systems),
- The ability to automate and scale without the need for human intervention or “manual fixes.”

I chose this slicer because I know PrusaSlicer thoroughly from practical experience—there simply wasn’t a better alternative offering a complete CLI, high performance, and deterministic results.

### S3/MinIO Storage and File Management Strategy

Initially, I considered between classic FTP and S3 buckets, which at the time were unfamiliar to me. Upon analysis, I found that S3/MinIO architecture was a perfect fit for the file management needs of this project.

The first tests showed how easily chaos can arise with a traditional approach—the lack of linkage between files and quotation or order sessions would result in disorder and data retention issues. Therefore, I immediately implemented logic binding files to sessions and orders, along with mechanisms for caching, automatic cleaning, and migrating files to target folders. These practices ensure organization, automation, GDPR compliance, and security at every stage of the file’s lifecycle.

## DevOps, Hosting, Security, Automation

I host everything on my own **homelab**, which I specifically upgraded (new CPU and RAM) to provide smooth operation of PrusaSlicer—even with many concurrent quotations. At the heart of the environment is Proxmox—each service (backend, both frontends, storage, MinIO, Prometheus) runs in a dedicated VM or LXC/Docker container.

Services are exposed to the public only where necessary (e.g., company website, backend), and full control is maintained via reverse proxy (Nginx Proxy Manager) with precisely configured forwarding to specific ports and machines. Additionally, all external communications are tightly limited by a firewall on the router—every incoming and outgoing connection is regulated by a set of dedicated rules and whitelists, effectively shielding services that don’t need to be public.

Cloudflare DNS provides an extra layer of protection—my server’s real IP address remains hidden, eliminating one of the most common attack vectors for home networks and bare-metal infrastructure.

Monitoring using Grafana and Prometheus allows me to constantly track resource usage, plan virtual machine scaling, implement automatic backups, maintenance tasks, and rolling updates, all without the risk of losing control over the production environment.

![prometheus](/images/projects/automated-quotation-system/prometheus.jpg "Backend resources monitoring")

### Introducing New Features and Deployment Workflow – Learning in Practice on a Live Project

This was my first web app of this scale, where I handled both the redesign and deployment of the frontend and backend by myself. Naturally, I wasn’t familiar with automated CI/CD tools, nor did I have ready-made schemes from larger teams. I developed my deployment workflow simply by experimenting—through trial, error, and iteration—until I found an effective way that worked well in my homelab environment.

I rolled out updates manually, as this path made the process easier to understand and allowed me to learn in real time how dependencies between built components functioned. I updated the frontend using my own `.sh` script, which automated replacing build files via FTP in the WordPress structure, while backend updates involved `git pull`, compilation, and service restarts via systemd over SSH.

This manual workflow, though slower than professional CI/CD, gave me full awareness of dependencies, taught me versioning discipline, and enabled quick rollbacks when things went wrong. For an MVP and a rapidly evolving project, it proved to be a great lesson in real-world release, deployment, and production environment management.

### Versioning and Environments – A Practical Evolution of Approach

Initially, I didn’t see the need to separate development and production environments—since I started solo and platform traffic was zero, it was natural to test everything “on the live system.” However, as the project quickly grew, with more features and real users onboard, I understood how risky it was to apply fixes and develop directly on production. This led to unexpected conflicts, regressions, and growing stress over rolling back problematic changes.

This real-world experience convinced me that, even for a solo, dynamic project, it’s best to establish clear environment separation: development, staging, and production, as well as maintain clear version chronology and easy rollback capability. From that point, my workflow included testing and experimenting in a sandbox, staging new features, and setting conscious safety “flags” when deploying to production.

Everything was based on a GitHub monorepo, where the three main modules (quotation platform frontend, admin panel frontend, backend) allowed for partial, independent deployments. Branching, pull requests, and code versioning taught me a procedural approach to changes and gave me a sense of control over an increasingly complex platform.

## Iterative Development, Automation Strategies, and the Feedback Loop

My daily routine revolved around a feedback loop: I ended each day by summarizing real progress, evaluating what worked and what still needed attention. I learned to think strategically—focusing first on the fundamentals, then implementing the details. Planning the backlog and roadmap taught me to combine the perspectives of developer, business owner, and end user.  
**Automation and optimization** were a natural outcome of observations at every implementation stage, including:
- Noticing S3 clutter during tests → implementing file-to-session associations and organization,
- Testing slicing with identical parameters → noticing unnecessary repeated server resource usage, leading me to implement a cache mechanism to block redundant load,
- The need to clean up files and optimize storage → developing dedicated admin tools, clean-up mechanisms, and integration enforcing order and retention in line with GDPR.

This organic development allows me today to **think and act as a CTO, product owner, and DevOps all in one**—I understand and apply the build-measure-learn cycle, constantly refining flow, and always asking: where else can I cut repetitive labor, improve UX, optimize the business? Ultimately, **it’s this mindset that gives any growing tech organization its competitive edge.**

## Security, Validation, and Resilience

As the number of features and integrations grew, system security became an increasing challenge. Experience showed me that every new feature can “break” even previously well-tested segments—the number of possible attack vectors and conflicts grows exponentially with each iteration.
I ensured:
- strict backend validation (e.g., upload validation, price manipulation locks),
- clear GDPR model (data deletion, retention, clean-up mechanisms for sessions and files outside the retention period),
- physical network safeguards (Cloudflare, reverse proxy, firewall),
- minimum privilege policy and physical separation of services (each service in its own container/LXC, ports open only where necessary).
**Key lesson:** The level of security is inversely proportional to the number of features if there’s no accompanying culture of testing, automatic validations, rollback procedures, and robust monitoring.

## Business Management and Optimization Through Technology

This project taught me to see the company as a dynamic mechanism that can be perfected through the automation of repetitive tasks—not just to speed up customer service, but to unlock new business models and volumes that were previously blocked by manual operator labor.

**Thanks to automated order handling:**
- Quotation processing scales almost without cost (more clients ≠ more work hours),
- I can easily hire more staff (admin panel → clear, everything at hand, straightforward procedures),
- Every further optimization/feature not only tweaks backend/frontend, but yields tangible operational business gains (better conversion, less chaos, faster cash flow).

My greatest satisfaction comes from the fact that—thanks to this platform—my company stopped being a collection of manually-executed, chaotic actions, and became an organized machine that operates by defined rules, procedures, and automated workflows. Now, I don’t “work in the company”—I work on the company: I can improve the system as a whole, implement further automations, optimize, expand, and refine the business model.

## Implementation Reflections and Optimization Potential

- In the next version, I’d separate the frontend as a standalone SPA under a subdomain (e.g., platform.geometryhustlers.pl), not within WordPress—better separation of concerns, more flexibility, and independent user and database management.
- Don’t implement features “just in case”—if there’s no real need, it’s not worth the time and resource investment.
- Frequent code reviews (by myself or supported by AI) and iterative cleaning of the legacy codebase prevent technical debt from accumulating.
- It’s worthwhile to set up monitoring from day one (Prometheus); it’s then easy to scale VMs, optimize flow, and avoid slowdowns as traffic or quotation volume increases.

---

**In summary:**  
This is not just a programming project—it’s a showcase of how combining engineering curiosity, dev/ops competence, a broad business outlook, and cutting-edge tools (AI, homelab, automation, storage) can, in practice, create a company managed like an efficient, scalable system—not a daily “firefight.”
Everything, from idea through architecture, development, to final technological deployment, was created with the mindset: seek points for optimization, automate repeatability, document every decision stage, and continuously engage with real business problems.
It’s precisely this approach—focusing on automation, tying everything into a clear system, and constantly searching for new value—that I believe is crucial for any CTO, founder, or manager thinking about building a business resilient to chaos and ready for rapid scaling.
This project demonstrates that with a “system” mindset and a readiness to experiment, you can—even as a solo founder—turn a company into a self-driving mechanism, ready for further development and efficient expansion.

---

# How It Works Under the Hood (Technical Deep Dive)

content in progress

---
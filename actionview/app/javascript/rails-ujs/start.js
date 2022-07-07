/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const {
  fire, delegate,
  getData, $,
  refreshCSRFTokens, CSRFProtection,
  loadCSPNonce,
  enableElement, disableElement, handleDisabledElement,
  handleConfirm, preventInsignificantClick,
  handleRemote, formSubmitButtonClick,
  handleMethod
} = Rails

// For backward compatibility
if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null)) {
  if (jQuery.rails) { throw new Error("If you load both jquery_ujs and rails-ujs, use rails-ujs only.") }
  jQuery.rails = Rails
  jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
    if (!options.crossDomain) { return CSRFProtection(xhr) }
  })
}

Rails.start = function() {
  // Cut down on the number of issues from people inadvertently including
  // rails-ujs twice by detecting and raising an error when it happens.
  if (window._rails_loaded) { throw new Error("rails-ujs has already been loaded!") }

  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener("pageshow", function() {
    $(Rails.formEnableSelector).forEach(function(el) {
      if (getData(el, "ujs:disabled")) { return enableElement(el) }
    })
    return $(Rails.linkDisableSelector).forEach(function(el) {
      if (getData(el, "ujs:disabled")) { return enableElement(el) }
    })
  })

  delegate(document, Rails.linkDisableSelector, "ajax:complete", enableElement)
  delegate(document, Rails.linkDisableSelector, "ajax:stopped", enableElement)
  delegate(document, Rails.buttonDisableSelector, "ajax:complete", enableElement)
  delegate(document, Rails.buttonDisableSelector, "ajax:stopped", enableElement)

  delegate(document, Rails.linkClickSelector, "click", preventInsignificantClick)
  delegate(document, Rails.linkClickSelector, "click", handleDisabledElement)
  delegate(document, Rails.linkClickSelector, "click", handleConfirm)
  delegate(document, Rails.linkClickSelector, "click", disableElement)
  delegate(document, Rails.linkClickSelector, "click", handleRemote)
  delegate(document, Rails.linkClickSelector, "click", handleMethod)

  delegate(document, Rails.buttonClickSelector, "click", preventInsignificantClick)
  delegate(document, Rails.buttonClickSelector, "click", handleDisabledElement)
  delegate(document, Rails.buttonClickSelector, "click", handleConfirm)
  delegate(document, Rails.buttonClickSelector, "click", disableElement)
  delegate(document, Rails.buttonClickSelector, "click", handleRemote)

  delegate(document, Rails.inputChangeSelector, "change", handleDisabledElement)
  delegate(document, Rails.inputChangeSelector, "change", handleConfirm)
  delegate(document, Rails.inputChangeSelector, "change", handleRemote)

  delegate(document, Rails.formSubmitSelector, "submit", handleDisabledElement)
  delegate(document, Rails.formSubmitSelector, "submit", handleConfirm)
  delegate(document, Rails.formSubmitSelector, "submit", handleRemote)
  // Normal mode submit
  // Slight timeout so that the submit button gets properly serialized
  delegate(document, Rails.formSubmitSelector, "submit", e => setTimeout((() => disableElement(e)), 13))
  delegate(document, Rails.formSubmitSelector, "ajax:send", disableElement)
  delegate(document, Rails.formSubmitSelector, "ajax:complete", enableElement)

  delegate(document, Rails.formInputClickSelector, "click", preventInsignificantClick)
  delegate(document, Rails.formInputClickSelector, "click", handleDisabledElement)
  delegate(document, Rails.formInputClickSelector, "click", handleConfirm)
  delegate(document, Rails.formInputClickSelector, "click", formSubmitButtonClick)

  document.addEventListener("DOMContentLoaded", refreshCSRFTokens)
  document.addEventListener("DOMContentLoaded", loadCSPNonce)
  return window._rails_loaded = true
}

if ((window.Rails === Rails) && fire(document, "rails:attachBindings")) {
  Rails.start()
}

const featureType = "alsavopro-status-feature";
const modeLabels = {
  heat: "Heat selected",
  cool: "Cool selected",
  auto: "Auto selected",
};

function supportsAlsavoPro(hass, context) {
  const attributes = hass?.states[context?.entity_id]?.attributes;
  return Boolean(attributes && Object.hasOwn(attributes, "configured_mode"));
}

class AlsavoProStatusFeature extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; text-align: center; }
      p { margin: 0; overflow-wrap: anywhere; }
      .fault { color: var(--warning-color, var(--primary-text-color)); font-weight: 600; }
      .mode { color: var(--secondary-text-color); }
      .fault:not([hidden]) + .mode { margin-top: 4px; }
    `;
    this.faultLine = document.createElement("p");
    this.faultLine.className = "fault";
    this.faultLine.setAttribute("aria-live", "polite");
    this.modeLine = document.createElement("p");
    this.modeLine.className = "mode";
    root.append(style, this.faultLine, this.modeLine);
    this.render();
  }

  setConfig() {}

  static getStubConfig() {
    return { type: `custom:${featureType}` };
  }

  set hass(hass) {
    this.homeAssistant = hass;
    this.render();
  }

  set context(context) {
    this.entityId = context?.entity_id;
    this.render();
  }

  set stateObj(state) {
    this.entityId = state?.entity_id ?? this.entityId;
    this.render();
  }

  render() {
    const entity = this.homeAssistant?.states[this.entityId];
    const available = entity && !["unknown", "unavailable"].includes(entity.state);
    const fault = available ? entity.attributes.fault : null;
    const mode = available ? modeLabels[entity.attributes.configured_mode] : null;
    this.faultLine.hidden = !fault;
    this.faultLine.textContent = fault
      ? [entity.state === "off" ? "Off" : null, ...fault.split(/[\r\n]+/)]
          .filter(Boolean)
          .join(" · ")
      : "";
    this.modeLine.hidden = !mode;
    this.modeLine.textContent = mode ?? "";
  }
}

if (!customElements.get(featureType)) {
  customElements.define(featureType, AlsavoProStatusFeature);
  window.customCardFeatures ??= [];
  window.customCardFeatures.push({
    type: featureType,
    name: "AlsavoPro heat pump status",
    isSupported: supportsAlsavoPro,
  });
}

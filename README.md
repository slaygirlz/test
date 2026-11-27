# AlsavoPro pool heat pump integration

Custom Home Assistant integration for pool heat pumps using the Alsavo Pro app, based on [gllmlbrt/AlsavoProHomeAssistantIntegration](https://github.com/gllmlbrt/AlsavoProHomeAssistantIntegration) and [goev/AlsavoProHomeAssistantIntegration](https://github.com/goev/AlsavoProHomeAssistantIntegration). Protocol work originates from [strandborg/AlsavoCtrl](https://github.com/strandborg/AlsavoCtrl).

## Improvements

- Thermostat activity: Off, Idle, Heating, Cooling and Defrosting.
- Reads pump data directly, so the separate compressor frequency sensor may remain disabled.
- Reconfigure the existing entry to edit connection details without deleting it.
- Retains existing entity and device identities across settings edits.

## Installation

Back up your existing `custom_components/alsavopro` folder, then replace it with this repository's `custom_components/alsavopro` folder and restart Home Assistant. Keep your existing integration entry.

For HACS, add `https://github.com/slaygirlz/test` as a custom repository with type Integration. If another repository already manages AlsavoPro, remove that HACS repository/download registration before switching; keep the Home Assistant integration entry. Back up before switching.

For a new installation, add AlsavoPro under Settings → Devices & services. Select Local or Cloud. Local connections normally use port `1194`. Use the pump serial number and password from the Alsavo Pro app.

## Edit connection details

Go to Settings → Devices & services → AlsavoPro and select **Reconfigure** from the entry's three-dot menu. Edit the name, serial number, address, port and password. A blank password retains the saved password. Saving reloads the integration. Serial changes are intended to correct the same pump, not replace it with a different device.

The form checks basic input validity, not whether the pump is reachable. Correct unreachable connection details by opening Reconfigure again.

## Activity mapping

| System running code | Thermostat activity |
|---|---|
| 1 | Idle |
| 2 | Defrosting — documented in AlsavoCtrl; not yet verified on this pump |
| 3 | Heating; Idle when compressor frequency is zero |
| 4 | Cooling; Idle when compressor frequency is zero |
| 5 or other unknown code | Activity unknown |

Power off overrides this mapping. An unavailable pump does not report activity. Codes 1, 3 and 4 were observed on the user's pump; mappings may differ on other models. Auto remains a selectable mode; code 5 is not assumed to indicate actual heating or cooling.

## Show the fault inside the thermostat card

The optional AlsavoPro status feature adds a row inside Home Assistant's native thermostat card. It uses the selected mode and fault already reported by the climate entity. If the heat pump shuts down on a water flow fault, the row shows **Off · Waiting for water flow** and the selected mode.

1. Copy [alsavopro-status-feature.js](dashboard/alsavopro-status-feature.js) to `/config/www/alsavopro-status-feature.js`. If you just created the `www` directory, restart Home Assistant.
2. Under **Settings → Dashboards → Resources**, add `/local/alsavopro-status-feature.js` as a **JavaScript module**. Enable Advanced Mode in your profile if the Resources menu is hidden.
3. Edit your existing Thermostat card in the dashboard and add **AlsavoPro heat pump status** under Features. In the YAML editor, you can keep the card's existing settings and append the feature to its `features` list.

```yaml
type: thermostat
entity: climate.pool
features:
  - type: custom:alsavopro-status-feature
```

Use your existing climate entity ID if it differs from `climate.pool`. If the feature does not appear after adding the resource, reload the dashboard.

## Validation

Python compilation, JSON parsing and isolated behavior checks passed. The checks use framework stand-ins and do not replace testing in Home Assistant. This update has not been tested on a live pump or Home Assistant instance.

Run checks with `python3 -m unittest discover -s tests -v`.

See [INSTALL.txt](INSTALL.txt) for additional installation and rollback notes.

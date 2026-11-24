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

## Validation

Python compilation, JSON parsing and isolated behavior checks passed. The checks use framework stand-ins and do not replace testing in Home Assistant. This update has not been tested on a live pump or Home Assistant instance.

Run checks with `python3 -m unittest discover -s tests -v`.

See [INSTALL.txt](INSTALL.txt) for additional installation and rollback notes.

# MHRBuilder

A free, community-made equipment builder for **Monster Hunter Rise: Sunbreak**.

MHRBuilder helps players browse equipment, explore armor skills, and plan their hunter builds. This project is independently developed for the Monster Hunter community.

## Features

- Browse armor and equipment.
- Filter armor by selected skills.
- View equipment skills and elemental defenses.
- Browse weapons and decoration slots.
- Manage charms locally in your browser.
- Run as a static website without a backend server.

## Getting Started

### Run Locally

Clone or download this repository:

```bash
git clone https://github.com/raffworksco-collab/MHRBuilder.git
cd MHRBuilder
```

Open `index.html` in a modern web browser.

Alternatively, use a local development server through Visual Studio Code.

### GitHub Pages

If GitHub Pages is enabled for this repository, access the deployed website using the URL configured under **Settings → Pages**.

## Project Structure

| File or directory | Purpose |
|---|---|
| `index.html` | Main equipment builder interface |
| `data.js` | Generated data used by the interface |
| `build_data.py` | Generates application data from source JSON files |
| `source_data/` | Source data for equipment, skills and decorations |
| `icons/` | Game-related icons used by the interface |
| `LICENSE` | Software license information |

## Updating Data

Edit the relevant JSON files inside `source_data/`, then regenerate the application data:

```bash
python build_data.py
```

Check the script output for validation errors before committing changes.

## Licensing

### Software Code

The project's software code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**, subject to the applicable license and copyright notices. See [`LICENSE`](LICENSE) for details.

This software license does not automatically grant rights to third-party artwork, game assets or other separately copyrighted materials.

### Game Assets and Intellectual Property

Monster Hunter Rise, Monster Hunter Rise: Sunbreak, and their associated names, characters, artwork, icons and other game assets belong to their respective rights holders, including Capcom.

Some visual assets included in this project were extracted from the game files. Their inclusion does not mean that this project owns those assets or has received separate permission to redistribute them.

No independent license or authorization from Capcom is claimed for these extracted assets. Users should not assume that the software license covers them.

For further information, consult [Capcom's official Video Policy](https://www.capcomusa.com/video-policy/). This policy concerns Capcom content in video and related contexts and should not be interpreted as specific authorization to redistribute extracted game assets through this application.

### Disclaimer

MHRBuilder is an independent fan project. It is not affiliated with, endorsed by, sponsored by or an official product of Capcom.

All trademarks and third-party intellectual property remain the property of their respective owners.

## Donations

MHRBuilder is provided free of charge for the community.

If you find this project useful and would like to support its continued development, voluntary donations are welcome but entirely optional. Donations are not required to access or use the project.

## Credits

- **Original project:** [simshadows/monster-hunter-rise-builder](https://github.com/simshadows/monster-hunter-rise-builder)
- **Game data reference:** [MHRice](https://mhrice.info/)
- **Game and related intellectual property:** Capcom and the respective rights holders.

This project builds upon existing community work. Please refer to the original repository and its license for applicable attribution and redistribution requirements.
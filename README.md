# MHRBuilder

A free, community-made equipment builder for **Monster Hunter Rise: Sunbreak**.

MHRBuilder helps players browse equipment, explore armor skills, and plan their hunter builds. The project is independently maintained and developed for the Monster Hunter community.

**Website:** [MHRBuilder](https://raffworksco-collab.github.io/MHRBuilder/)

**Support development:** [Buy Me a Coffee ☕](https://buymeacoffee.com/raffworks)

## Features

* Browse armor and equipment.
* Filter armor by selected skills.
* View equipment skills and elemental defenses.
* Browse weapons and decoration slots.
* Manage charms locally in your browser.
* Run as a static website without a backend server.

## Getting Started

### Use the Website

Visit [MHRBuilder on GitHub Pages](https://raffworksco-collab.github.io/MHRBuilder/).

### Run Locally

Clone or download this repository:

```bash
git clone https://github.com/raffworksco-collab/MHRBuilder.git
cd MHRBuilder
```

Open `index.html` in a modern web browser.

Alternatively, use a local development server through Visual Studio Code.

## Project Structure

| File or directory | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `index.html`      | Main equipment builder interface                  |
| `data.js`         | Generated data used by the interface              |
| `build_data.py`   | Generates application data from source JSON files |
| `source_data/`    | Source data for equipment, skills and decorations |
| `icons/`          | Game-related icons used by the interface          |
| `LICENSE`         | Software license information                      |

## Updating Data

Edit the relevant JSON files inside `source_data/`, then regenerate the application data:

```bash
python build_data.py
```

Check the script output for validation errors before committing changes.

## Licensing

### Software Code

The project's software code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**, subject to the applicable license and copyright notices. See [`LICENSE`](LICENSE) for details.

The software license does not automatically grant rights to third-party artwork, game assets, or other separately copyrighted materials.

### Game Assets and Intellectual Property

Monster Hunter Rise, Monster Hunter Rise: Sunbreak, and their associated names, characters, artwork, icons, and other game assets belong to their respective rights holders, including Capcom.

Some visual assets included in this project were extracted from game files. Their inclusion does not mean that this project owns those assets or has received separate permission to redistribute them.

No independent license or authorization from Capcom is claimed for these extracted assets. Users should not assume that the software license covers them.

For further information, consult [Capcom's official Video Policy](https://www.capcomusa.com/video-policy/). This policy concerns Capcom content in video and related contexts and should not be interpreted as specific authorization to redistribute extracted game assets through this application.

### Disclaimer

MHRBuilder is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by Capcom.

All trademarks and third-party intellectual property remain the property of their respective owners.

## Donations

MHRBuilder is free to use.

If you find the project useful and would like to support its continued development, voluntary donations are welcome but entirely optional. Donations are not required to access or use the project.

[**Support RaffWorks on Buy Me a Coffee ☕**](https://buymeacoffee.com/raffworks)

## Credits

* **Original project:** [simshadows/monster-hunter-rise-builder](https://github.com/simshadows/monster-hunter-rise-builder)
* **Development and modifications:** RaffWorks
* **Game data reference:** [MHRice](https://mhrice.info/)
* **Game and related intellectual property:** Capcom and the respective rights holders.

MHRBuilder builds upon existing community work and includes modifications. Please refer to the original repository and its license for applicable attribution and redistribution requirements.

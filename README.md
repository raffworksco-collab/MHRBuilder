# MHRBuilder

A free, community-made equipment builder for **Monster Hunter Rise: Sunbreak**.

MHRBuilder helps players browse equipment, explore armor skills, and plan their hunter builds. The project is independently maintained and developed for the Monster Hunter community.

**Website:** [MHRBuilder](https://raffworksco-collab.github.io/MHRBuilder/)

**Support development (optional):** [Buy Me a Coffee ☕](https://buymeacoffee.com/raffworks)

## Features

* Browse armor and equipment.
* Filter armor by selected skills.
* View equipment skills and elemental defenses.
* Browse weapons, rampage decorations and decoration slots.
* Manage charms locally in your browser.
* **Saved builds:** keep up to 30 planned builds in named save slots and load them later.
* **Export builds:** copy a build as plain text, download it as a PNG image, or back up and restore all saved builds as a JSON file.
* **Collapsible panels:** fold the Skills sidebar, the Equipment panel and the Armor list so a finished build can be viewed in full without scrolling through the whole armor list.
* **Responsive layout:** adapts to small laptops and phones without zooming out. On narrow screens the tables turn into stacked cards.
* Run as a static website without a backend server.

## Using Saved Builds

1. Select skills, armor, a weapon and a charm as usual.
2. Open **💾 Builds** in the Equipment header, type a name and press **Save**.
3. Later, open **💾 Builds** again and press **Load** on any slot to restore the build and its target skills.
4. Use **Copy text** or **PNG** on the current build or on any saved slot to export it.
5. Use **Backup all (.json)** and **Import (.json)** to move your slots to another browser or device.

Saved builds, charms, panel state and other settings are stored in your browser's local storage on your own device. Nothing is uploaded to a server. Clearing your browser's site data removes them, so use the backup option for builds you want to keep.

Exported text and PNG files contain only the build's names, skill levels and numbers. They do not include game artwork or icons.

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

If you are a rights holder and have a concern about any content in this repository, please open an issue in the repository so it can be reviewed promptly.

### Disclaimer

MHRBuilder is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by Capcom.

All trademarks and third-party intellectual property remain the property of their respective owners.

## Support the Project ☕

If MHRBuilder has helped you plan a build or made comparing equipment a little easier, thank you for giving it a try! If you’d like to support its continued development, you’re welcome to [buy me a coffee](https://buymeacoffee.com/raffworks). Your support is appreciated and helps encourage ongoing maintenance and improvements.

There’s absolutely no obligation to donate. MHRBuilder is free to use, and all features are available to everyone whether they donate or not.

A few important notes:

* Donations are voluntary and support the developer’s time spent maintaining and improving the software.
* Donations do not buy, license, or unlock Capcom content, game assets, or game data. Nothing is sold through this project.
* Donating does not provide special access, features, or rights.
* The donation page is run by the developer and is not run by, endorsed by, or connected to Capcom. Donations are not payments to Capcom or any other rights holder.
* The Monster Hunter name and related material are referenced only to describe what this fan-made tool is for.

Thanks for being part of the community—whether you donate, share feedback, report an issue, or simply use the builder. It all helps!

## Credits

* **Original project:** [simshadows/monster-hunter-rise-builder](https://github.com/simshadows/monster-hunter-rise-builder)
* **Development and modifications:** RaffWorks
* **Game data reference:** [MHRice](https://mhrice.info/)
* **Game and related intellectual property:** Capcom and the respective rights holders.

MHRBuilder builds upon existing community work and includes modifications. Please refer to the original repository and its license for applicable attribution and redistribution requirements.

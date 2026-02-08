# 3D Globe Threat Intelligence Visualization

An interactive 3D globe and flat map visualization for displaying threat intelligence data with solar system background effects.

## Features

### 3D Globe Mode
- **Interactive 3D rotating globe** with auto-rotation
- **Zoom in/out** to reveal solar system planets in the background
- **8 different texture modes**:
  - WAR-OPS: Topographic relief map
  - NIGHT VISION: Dark earth view
  - THERMAL: Water coverage map
  - TACTICAL: Blue marble satellite view
  - SATELLITE: Daytime earth view
  - DARK-OPS: Night view with glowing city lights
  - BORDERS: Country boundaries with cyan outlines
  - CLASSIC: Standard blue marble

### Flat Map Mode
- **Seamless 3D to 2D transformation** with animated flip
- **Proper Mercator projection** (2:1 aspect ratio)
- **Mouse wheel zoom** (1x to 5x)
- **Click and drag** to pan around the map
- **Clickable threat markers** for detailed information

### Visual Effects
- **Animated starfield background**
- **Solar system planets** that appear when zoomed out
- **Solar glow effect** in the center
- **Threat pillars** with glowing colors based on severity

## Usage

Simply open `index.html` in a modern web browser!

### Controls
- **3D Mode**: Mouse wheel to zoom, drag to rotate
- **2D Mode**: Mouse wheel to zoom, drag to pan
- **Mode Toggle**: Click "Flatten Map" button
- **Textures**: Click texture buttons at the bottom

## Technology

Built with globe.gl, Three.js, and vanilla JavaScript.

## Contributing

When contributing, please use this commit message template:

```


# Piggy Benissy says: Write a good commit message above!
#
#        _._ _..._ .-',     _.._(``))
#       '-. `     '  /-._.-'    ',/
#          )         \            '.
#         / _    _    |             \
#        |  a    a    /              |
#        \   .-.                     ;
#         '-('' ).-'       ,'       ;
#            '-;           |      .'
#               \           \    /
#               | 7  .__  _.-\   \
#               | |  |  ``    |    |
#              /,_|  |   /,_/    /
#                 /,_/      '----'
#
# - @SimeonGarratt
```

## License

MIT License

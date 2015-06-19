## What is Toast notifications ?

Toast is a simple Javascript module that convert all existing notifications
located into HTML static code into a beautiful notifications. This module is
written in pure JS. The only dependency it has is the CSS3 animations framework
[Magic Animations](http://www.minimamente.com/example/magic_animations/).

## Installation

```bash
bower install toast-notifications
```

After doing this command, you just have to add this following lines :

```html
<link rel="stylesheet" href="path/to/toast/dist/css/toast.min.css" />
<script src="path/to/toast/dist/js/toast.min.hs"></script>
```

## How to use

Once you've load the javascript file and the CSS stylesheet, you have two
choices :

- You use server language, you could write notifications into the HTML code
- You want generate notify directly with Javascript

### Server language

On server side, you'll set all notifications into the same place. So, just add
an ID or a class and use it into Toast guess method

```html
<div class="notifications">
	<p class="notify alert">An error occurred...</p>
</div>
 ```
```javascript
Toast.guess(document.querySelector(".notifications"))
```

### Javascript

Wherever in you script, you could run this command like :

```javascript
new Toast("info", "Welcome home!")
```

### Options

This module can be customize by the `setOptions()` method like that :

```javascript
Toast.setOptions({
	timelife : true,
	delay    : 7,
	onShow   : "spaceInDown",
	onHide   : "spaceOutUp"
});
```

- `timelife` show timelife of each notification
- `delay` time since the notification will disapear
- `onShow` animation to use on show (see [Magic Animation
  doc](http://www.minimamente.com/example/magic_animations/))
- `onHide` animation to use on hide (see [Magic Animation
  doc](http://www.minimamente.com/example/magic_animations/))

You can also customize the animation time. Follow [this
link](https://github.com/miniMAC/magic) for more informations.

### Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Toast</title>
	<meta charset="UTF-8">

	<link href="../dist/css/toast.min.css" rel="stylesheet" />
</head>
<body>
	<div class="notifications">
		<p class="notify success">You're account has been updated!</p>
		<p class="notify error">An error occurred... Please try later!</p>
	</div>
	
	<script src="../dist/js/toast.js"></script>
	<script>
		(function() {
			// Settings up module
			Toast.setOptions({
				delay : 10
			});

			// Generate toasts by static elements
			Toast.guess(document.querySelector(".notifications"));

			// Generate toasts on the fly
			setTimeout(function() {
				new Toast("info", "test");
			}, 1000);

			setTimeout(function() {
				new Toast("alert", "test");
			}, 2000);

			setTimeout(function() {
				new Toast("success", "test");
			}, 3000);

			setTimeout(function() {
				new Toast("warning", "test");
			}, 3200);
		})();
	</script>
</body>
</html>
```

## Contributions

Everyone can fork and propose some modifications of this module.
A Gulpfile is provided in order to accelerate development process. So, just run
theses simples commands to install all dependencies developments packages :

```bash
npm install
gulp build
```

You can also use a watcher with this command :

```bash
gulp watch
```

## License

MIT

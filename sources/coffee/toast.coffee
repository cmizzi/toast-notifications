###
# The MIT License (MIT)
#
# Copyright (c) 2015 - Studionet
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
###

window.Toast = class Toast
	notify     : null
	options    : null
	@container : null
	@options   :
		timelife : true          # Is timelife show ?
		delay    : 7             # Delay of each notification
		onShow   : "spaceInDown" # Effect on show
		onHide   : "spaceOutUp"  # Effect on hide

	constructor : (type, message) ->
		# Create a container if doesn't exists
		@createContainer() if not Toast.container

		# Add a new notification
		@notify type, message

	@configureOptions : (given) ->
		options = Toast.options

		if typeof(given) isnt 'object'
			return options

		for key, property of given
			if options[key] is undefined
				throw "`#{key}` option doesn't exist"

			options[key] = property

		return options

	getOption : (name) ->
		return Toast.options[name]

	setClasses : (classes) ->
		if classes instanceof Object
			@notify.classList.add cls for cls in classes
			return

		@notify.classList.add cls for cls in classes.split(" ")

	notify : (type, message) ->
		# Create notification element
		@notify = document.createElement "li"
		@notify.classList.add "toasts-notify"
		@notify.classList.add "magictime"
		@notify.classList.add @getOption "onShow"
		@notify.innerHTML = message
		@setClasses type

		# If timelife option is true
		if @getOption "timelife"
			timelife = document.createElement "div"
			timelife.classList.add "toasts-timelife"
			@notify.appendChild timelife

		# Define a timer to define when the notification will disapear
		timer = new Date()
		timer.setSeconds timer.getSeconds() + @getOption "delay"
		@notify.timer = timer

		try
			Toast.container.insertBefore @notify, Toast.container.firstChild
		catch e
			Toast.container.appendChild @notify

		@remove()

	remove : ->
		that   = @
		hidden = false

		setTimeout ->
			current = new Date()

			if current >= that.notify.timer
				# Add effect on hide and return to avoid empty timeout
				if not that.notify.classList.contains "ondeHide"
					that.notify.classList.remove that.getOption "onShow"
					that.notify.classList.add    that.getOption "onHide"

				that.notify.addEventListener that.checkAnimations(), (event) ->
					if event.animationName isnt that.getOption "onHide"
						return

					that.notify.remove()

				return

			if that.getOption "timelife"
				# Let's calculate the width timelife
				timelife = that.notify.querySelector ".toasts-timelife"
				width    = timelife.clientWidth

				delta = current - that.notify.timer

				delta = Math.abs delta
				delta = delta / 1000
				delta = Math.round delta

				width = width - (width / delta)
				timelife.style.width = "#{width}px"

			that.remove()

		# As we work with seconds, update the status every second
		, 1000

	checkAnimations : ->
		animations =
			'animation'       : 'animationend'
			'OAnimation'      : 'oAnimationEnd'
			'MozAnimation'    : 'animationend'
			'WebkitAnimation' : 'webkitAnimationEnd'

		for label, animation of animations
			if @notify.style[label] isnt undefined
				return animation

	createContainer : ->
		# Create notifications container
		container = document.createElement "ul"
		container.classList.add "toasts-container"

		# Append it to the body end
		document.body.appendChild container

		# Define the container as static var
		Toast.container = container

	@guess : (container, options) ->
		container.classList.add "hide"

		for node in container.childNodes
			continue if node.nodeType is 3
			new Toast node.classList, node.innerHTML, options

	@setOptions : (options) ->
		Toast.options = Toast.configureOptions options

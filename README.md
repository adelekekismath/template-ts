
# Project Report: Interactive Clock Application

# Install  and run project

```javascript
nvm use
npm install
npm run start
```

## Introduction
This project focuses on developing an interactive clock application that supports both digital and analog clocks. The primary goal was to create a modular application while applying the MVC (Model-View-Controller) architectural pattern using TypeScript Vanilla.

## Technical Implementation

### Project Structure
**MVC Architecture**: The project is structured using the MVC pattern, ensuring a clear separation of concerns:
- **Model**: Manages the data, including hours, minutes, and seconds.
- **View**: Responsible for rendering the clocks. Separate views were created for analog and digital clocks.
- **Controller**: Handles user interactions and updates the model and view accordingly.

### Key Features
- **Analog and Digital Clocks**:  The digital clock was designed to update in real-time, displaying the current time in hours, minutes, and seconds. Initially, the analog clock's hands were erased and redrawn using the <canvas> element, but this approach was resource-intensive. To optimize performance, I transitioned to using the matrix() function in CSS, allowing for smoother and more efficient movement of the clock hands without the need to recreate them entirely each time.
- **Timezone Management**: Users can select timezones, and the application adjusts the clocks according to the selected GMT offset.
- **User Interactions**:
  - Users can add new clocks by selecting the clock's type and timezone.
  - Clocks can be rearranged via drag-and-drop and removed individually.
  -  Users can  directly manipulate the clock hands to set the time, pausing the analog clock during adjustments.

### Challenges Encountered
- **Matrix Transformations**: Implementing accurate transformations for the clock hands in the analog clock was challenging. Ensuring that rotations and translations were applied correctly without distorting the hands required careful calculation and testing.
- **User Interaction Consistency Drag-and-Drop Functionality**: Implementing a smooth drag-and-drop experience for rearranging clocks was more challenging than anticipated. Ensuring consistent performance, especially when dragging clocks across different devices and screen sizes, required  testing and fine-tuning of the drag-and-drop logic.


## Future Improvements

### UI Enhancements
- **Custom Themes**: Implement user-selectable themes to personalize clock appearances.

### Advanced Features
- **Multi-language Support**: Add support for multiple languages to enhance global usability.

## Conclusion
This project served as a practical exploration of advanced web development concepts, including DOM manipulation with TypeScript, geometric transformations, and real-time event handling. The challenges faced and overcome during development have laid the foundation for future enhancements and optimizations, making the application both robust and extensible.








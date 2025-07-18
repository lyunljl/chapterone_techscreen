import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import Constants from 'expo-constants';

/**
 * Color Theme Configuration
 * 
 * This object centralizes all colors used throughout the app.
 * Using a single source of truth for colors makes it easier to:
 * - Maintain consistent styling
 * - Make theme changes in the future
 * - Understand the color palette at a glance
 */
const COLORS = {
  primary: '#FF8C00',    // Orange - Used for buttons, accents, and highlights
  background: '#000000', // Black - Main app background
  text: '#FFFFFF',       // White - Text color for readability on dark backgrounds
  cardBg: '#1A1A1A',     // Dark gray - Used for task item backgrounds
  completed: '#4CAF50',  // Green - Indicates completed tasks
  delete: '#FF4500'      // Orange-red - Used for delete buttons
};

/**
 * Main App Component
 * 
 * A simple Task Manager app that allows users to:
 * - Add new tasks with a text input
 * - Mark tasks as complete/incomplete by tapping on them
 * - Delete tasks with a delete button
 * - Automatically adjusts for keyboard appearance
 * 
 * The app uses React hooks for state management and follows a
 * clean, component-based architecture.
 */
export default function App() {
  /**
   * State Management
   * 
   * Using React's useState hook to manage application state:
   * - tasks: Array of task objects with id, text, and completed status
   * - taskText: Current value of the input field
   * - isKeyboardVisible: Tracks if the keyboard is currently displayed
   */
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  /**
   * Keyboard Event Handling
   * 
   * Sets up event listeners for keyboard appearance/disappearance.
   * This helps the UI adjust when the keyboard is shown or hidden.
   * The useEffect hook ensures listeners are properly set up and cleaned up.
   */
  useEffect(() => {
    // Create listeners for keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts to prevent memory leaks
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  /**
   * Add Task Function
   * 
   * Creates a new task and adds it to the tasks array.
   * - Validates that the task text is not empty
   * - Creates a unique ID using timestamp
   * - Adds the new task to the existing tasks array
   * - Clears the input field
   * - Dismisses the keyboard
   */
  const addTask = () => {
    // Validate: Don't add empty tasks
    if (taskText.trim() === '') return;
    
    // Create a new task object with unique ID
    const newTask = {
      id: Date.now().toString(), // Use timestamp as unique ID
      text: taskText,
      completed: false
    };
    
    // Add the new task to the tasks array using spread operator to maintain immutability
    setTasks([...tasks, newTask]);
    
    // Reset the input field
    setTaskText('');
    
    // Dismiss keyboard after adding task for better UX
    Keyboard.dismiss();
  };

  /**
   * Toggle Task Completion Status
   * 
   * Changes a task's completed status when the user taps on it.
   * Uses array mapping to create a new array with the updated task.
   * 
   * @param {string} id - The unique ID of the task to toggle
   */
  const toggleTask = (id) => {
    // Map through tasks and only modify the one with matching ID
    setTasks(tasks.map(task => 
      task.id === id 
        ? {...task, completed: !task.completed} // Toggle the completed status
        : task // Leave other tasks unchanged
    ));
  };

  /**
   * Delete Task Function
   * 
   * Removes a task from the list when the delete button is pressed.
   * Uses array filtering to create a new array without the deleted task.
   * 
   * @param {string} id - The unique ID of the task to delete
   */
  const deleteTask = (id) => {
    // Filter out the task with the matching ID
    setTasks(tasks.filter(task => task.id !== id));
  };

  /**
   * Render Task Item
   * 
   * This function defines how each task item should be displayed.
   * It includes:
   * - A checkbox to indicate completion status
   * - The task text
   * - A delete button
   * 
   * The function is passed to FlatList to render each item in the task list.
   * 
   * @param {Object} param0 - Destructured object containing the task item
   * @returns {JSX.Element} - The rendered task item component
   */
  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      {/* Task text with toggle functionality */}
      <TouchableOpacity 
        style={styles.taskTextContainer} 
        onPress={() => toggleTask(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
        accessibilityLabel={item.completed ? "Mark task as incomplete" : "Mark task as complete"}
      >
        {/* Checkbox indicator - visual representation of task status */}
        <View style={[
          styles.checkbox,
          item.completed && styles.checkboxCompleted
        ]} />
        
        {/* Task text - shows the task description */}
        <Text style={[
          styles.taskText,
          item.completed && styles.completedTaskText
        ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      
      {/* Delete button - allows removing the task */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => deleteTask(item.id)}
        accessibilityRole="button"
        accessibilityLabel="Delete task"
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Main App Render
   * 
   * The main UI structure of the application, including:
   * - SafeAreaView to handle device notches and system UI
   * - StatusBar configuration
   * - App header
   * - KeyboardAvoidingView to handle keyboard appearance
   * - Task list with FlatList for efficient rendering
   * - Input container for adding new tasks
   */
  return (
    <SafeAreaView style={styles.container}>
      {/* Configure status bar to match the app theme */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* App Header - displays the app title */}
      <Text style={styles.header}>Task Manager</Text>
      
      {/* KeyboardAvoidingView - ensures the input is visible when keyboard appears */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Task List - displays all tasks using FlatList for performance */}
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No tasks yet. Add one below!
            </Text>
          }
          accessibilityLabel="Task list"
        />
        
        {/* Add Task Input - allows users to enter new tasks */}
        <View style={styles.inputContainer}>
          {/* Text input field */}
          <TextInput
            style={styles.input}
            value={taskText}
            onChangeText={setTaskText}
            placeholder="Enter a task..."
            placeholderTextColor="#888888"
            accessibilityLabel="Task input field"
            onSubmitEditing={addTask} // Allow adding task by pressing return/enter
          />
          
          {/* Add button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addTask}
            accessibilityRole="button"
            accessibilityLabel="Add task"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * StyleSheet Definition
 * 
 * This section defines all the styles used throughout the app.
 * Styles are organized by component for easy reference.
 * The StyleSheet.create method optimizes styles for performance.
 */
const styles = StyleSheet.create({
  /**
   * Container Styles
   */
  container: {
    flex: 1, // Take up all available space
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0, // Adjust for Android status bar
    padding: 20, // Add padding around all content
  },
  keyboardAvoidingView: {
    flex: 1, // Take up all available space
  },
  
  /**
   * Header Styles
   */
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: COLORS.primary,
  },
  
  /**
   * List Styles
   */
  list: {
    flex: 1, // Take up available space
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontSize: 16,
  },
  
  /**
   * Task Item Styles
   */
  taskItem: {
    backgroundColor: COLORS.cardBg,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space out children
    marginBottom: 10,
    elevation: 2, // Android shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  taskTextContainer: {
    flex: 1, // Take up available space
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Center items vertically
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.completed,
    borderColor: COLORS.completed,
  },
  taskText: {
    fontSize: 16,
    flex: 1, // Take up available space
    color: COLORS.text,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888', // Dimmed color for completed tasks
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15, // Makes it circular
    backgroundColor: COLORS.delete,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  deleteButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  /**
   * Input Area Styles
   */
  inputContainer: {
    flexDirection: 'row', // Arrange children horizontally
    marginTop: 20,
  },
  input: {
    flex: 1, // Take up available space
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  addButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
}); 
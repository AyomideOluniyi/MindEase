import 'react-native-reanimated';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ChatScreen() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const scrollViewRef = useRef();


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'You', message: input };
    const newChat = [...chat, userMessage];
    setChat(newChat);
    setInput('');

    try {
      const response = await fetch('https://3ee4b07cf1ee.ngrok-free.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: newChat,
        }),
      });

      const data = await response.json();
      const botMessage = { sender: 'Bot', message: data.reply };
      setChat([...newChat, botMessage]);
    } catch (error) {
      console.error(error);
      setChat([
        ...newChat,
        { sender: 'Bot', message: 'Sorry, something went wrong.' },
      ]);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <Text style={styles.title}>MindEase</Text>
      <ScrollView
        style={styles.chatBox}
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled">
        {chat.map((msg, idx) => (
          <View
            key={idx}
            style={msg.sender === 'You' ? styles.userBubble : styles.aiBubble}>
            <Text style={styles.bubbleText}>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="How are you feeling today?"
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MoodLoggerScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [moodLog, setMoodLog] = useState([]);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😵', label: 'Overwhelmed' },
  ];

 const logMood = async () => {
  if (!selectedMood) return;

  const entry = {
    mood: selectedMood,
    note,
    timestamp: new Date().toISOString(),
  };

  const updatedLog = [entry, ...moodLog];
  setMoodLog(updatedLog);

  try {
    await AsyncStorage.setItem('moodLog', JSON.stringify(updatedLog));
  } catch (error) {
    console.error('Failed to save mood log:', error);
  }

  setSelectedMood(null);  
  setNote('');           
  alert('Mood logged!');
};

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Mood Logger</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.moodGrid}>
          {moods.map((mood, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.moodCard,
                selectedMood === mood.label && styles.moodCardSelected,
              ]}
              onPress={() => setSelectedMood(mood.label)}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          placeholderTextColor="#aaa"
          value={note}
          multiline
          onChangeText={setNote}
        />
        <TouchableOpacity style={styles.logButton} onPress={logMood}>
          <Text style={styles.logButtonText}>Log Mood</Text>
        </TouchableOpacity>
        {moodLog.map((entry, i) => (
          <View key={i} style={styles.logItem}>
            <Text style={styles.logMood}>
              {entry.timestamp} - {entry.mood}
            </Text>
            <Text style={styles.logNote}>{entry.note}</Text>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function JournalScreen() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const saveEntry = () => {
    if (!entry.trim()) return;
    const newEntry = {
      text: entry,
      date: new Date().toLocaleDateString(),
    };
    setEntries([newEntry, ...entries]);
    setEntry('');
    alert('Journal saved!');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Daily Reflection</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Write your thoughts for today..."
        placeholderTextColor="#aaa"
        value={entry}
        onChangeText={setEntry}
        multiline
      />
      <TouchableOpacity style={styles.logButton} onPress={saveEntry}>
        <Text style={styles.logButtonText}>Save Reflection</Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: 20 }}>
        {entries.map((e, i) => (
          <View key={i} style={styles.logItem}>
            <Text style={styles.logMood}>{e.date}</Text>
            <Text style={styles.logNote}>{e.text}</Text>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

function WeeklySummaryScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadMoodLog = async () => {
      try {
        const stored = await AsyncStorage.getItem('moodLog');
        const storedLog = stored ? JSON.parse(stored) : [];
        const weekData = {};

        storedLog.forEach((entry) => {
          const date = new Date(entry.timestamp).toLocaleDateString();
          if (!weekData[date]) weekData[date] = {};
          if (!weekData[date][entry.mood]) weekData[date][entry.mood] = 0;
          weekData[date][entry.mood]++;
        });

        const formatted = Object.entries(weekData).map(([date, moods]) => ({
          date,
          ...moods,
        }));

        setData(formatted);
      } catch (error) {
        console.error('Failed to load mood log:', error);
      }
    };

    loadMoodLog();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Mood Summary</Text>
      {data.length === 0 ? (
        <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
          No mood data found for this week.
        </Text>
      ) : (
        data.map((day, i) => (
          <View key={i} style={styles.logItem}>
            <Text style={styles.logMood}>{day.date}</Text>
            {Object.entries(day).map(
              ([mood, count]) =>
                mood !== 'date' && (
                  <Text key={mood} style={styles.logNote}>
                    {mood}: {count}
                  </Text>
                )
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#4B7BEC',
    tabBarInactiveTintColor: '#aaa',
    tabBarStyle: { backgroundColor: '#000', borderTopColor: '#222' },
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === 'Chat') iconName = 'chatbubble-outline';
      else if (route.name === 'Mood Logger') iconName = 'happy-outline';
      else if (route.name === 'Journal') iconName = 'book-outline';
      else if (route.name === 'Weekly Summary') iconName = 'bar-chart-outline';
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}>
  <Tab.Screen name="Chat" component={ChatScreen} />
  <Tab.Screen name="Mood Logger" component={MoodLoggerScreen} />
  <Tab.Screen name="Journal" component={JournalScreen} />
  <Tab.Screen name="Weekly Summary" component={WeeklySummaryScreen} />
</Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
  chatBox: { flex: 1, marginBottom: 12 },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4B7BEC',
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  bubbleText: { color: '#fff', fontSize: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    padding: 12,
    borderRadius: 50,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#4B7BEC',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: 'white', fontSize: 16 },

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  moodCard: {
    width: '28%',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginVertical: 8,
  },
  moodCardSelected: { backgroundColor: '#4B7BEC' },
  moodEmoji: { fontSize: 24, color: '#fff' },
  moodLabel: { marginTop: 6, fontWeight: '500', color: '#fff' },

  noteInput: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
    marginVertical: 10,
  },
  logButton: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  logButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  logItem: {
    backgroundColor: '#111',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  logMood: { fontWeight: 'bold', fontSize: 16, color: '#fff' },
  logNote: { marginTop: 4, color: '#ccc' },
});

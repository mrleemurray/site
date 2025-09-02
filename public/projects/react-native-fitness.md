---
id: react-native-fitness
title: React Native Fitness App
subtitle: Comprehensive fitness tracking mobile app
description: Cross-platform fitness tracking application with workout logging, progress analytics, social features, and health integration.
category: experiments
tags: [React Native, TypeScript, Expo, MongoDB, Firebase]
image: /images/react-native-fitness.svg
featured: false
liveUrl: ""
sourceUrl: https://github.com/username/fitness-app
completedAt: 2024-03-10
duration: 5 weeks
---

# React Native Fitness App

A comprehensive fitness tracking mobile application built with React Native and Expo.

![Fitness App Screenshots](/images/react-native-fitness.svg)

## Overview

The Fitness App helps users track workouts, monitor progress, and maintain healthy habits. Built with React Native for cross-platform compatibility and featuring offline-first architecture.

### Key Features

- **Workout Tracking**: Log exercises with sets, reps, and weights
- **Progress Analytics**: Visual charts showing fitness improvements
- **Custom Workouts**: Create and share personalized workout routines
- **Social Features**: Connect with friends and share achievements
- **Health Integration**: Sync with Apple Health and Google Fit
- **Offline Support**: Full functionality without internet connection

## Technical Stack

```json
{
  "mobile": {
    "framework": "React Native",
    "platform": "Expo",
    "language": "TypeScript",
    "navigation": "React Navigation",
    "state": "Zustand",
    "ui": "NativeBase"
  },
  "backend": {
    "runtime": "Node.js",
    "database": "MongoDB",
    "auth": "Firebase Auth",
    "storage": "Firebase Storage"
  },
  "tools": {
    "development": "Expo Dev Tools",
    "testing": "Jest + Detox",
    "ci": "GitHub Actions"
  }
}
```

## App Architecture

### State Management with Zustand

```typescript
interface WorkoutStore {
  workouts: Workout[]
  currentWorkout: Workout | null
  addWorkout: (workout: Workout) => void
  startWorkout: (workoutId: string) => void
  completeWorkout: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, workout]
  })),
  
  startWorkout: (workoutId) => set((state) => ({
    currentWorkout: state.workouts.find(w => w.id === workoutId) || null
  })),
  
  completeWorkout: () => set((state) => {
    const completedWorkout = {
      ...state.currentWorkout!,
      completedAt: new Date(),
      status: 'completed' as const
    }
    
    return {
      currentWorkout: null,
      workouts: state.workouts.map(w => 
        w.id === completedWorkout.id ? completedWorkout : w
      )
    }
  })
}))
```

### Navigation Structure

```typescript
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="ExerciseForm" component={ExerciseFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## Key Components

### Workout Timer

```typescript
interface TimerProps {
  duration: number
  onComplete: () => void
}

export const WorkoutTimer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onComplete()
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onComplete])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setTimeLeft(duration)
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <View style={styles.timerButtons}>
        <TouchableOpacity onPress={toggleTimer} style={styles.button}>
          <Text>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
```

### Exercise Form

```typescript
interface ExerciseFormProps {
  onSave: (exercise: Exercise) => void
  initialData?: Partial<Exercise>
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ 
  onSave, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sets: initialData?.sets || 3,
    reps: initialData?.reps || 10,
    weight: initialData?.weight || 0,
    notes: initialData?.notes || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required'
    }
    
    if (formData.sets < 1) {
      newErrors.sets = 'Must have at least 1 set'
    }
    
    if (formData.reps < 1) {
      newErrors.reps = 'Must have at least 1 rep'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        id: initialData?.id || Date.now().toString(),
        ...formData,
        completedAt: new Date()
      })
    }
  }

  return (
    <ScrollView style={styles.container}>
      <VStack space={4}>
        <FormControl isInvalid={'name' in errors}>
          <FormControl.Label>Exercise Name</FormControl.Label>
          <Input
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="e.g., Push-ups"
          />
          <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
        </FormControl>

        <HStack space={4}>
          <FormControl flex={1} isInvalid={'sets' in errors}>
            <FormControl.Label>Sets</FormControl.Label>
            <Input
              keyboardType="numeric"
              value={formData.sets.toString()}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                sets: parseInt(text) || 0 
              }))}
            />
          </FormControl>

          <FormControl flex={1} isInvalid={'reps' in errors}>
            <FormControl.Label>Reps</FormControl.Label>
            <Input
              keyboardType="numeric"
              value={formData.reps.toString()}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                reps: parseInt(text) || 0 
              }))}
            />
          </FormControl>
        </HStack>

        <Button onPress={handleSubmit}>
          Save Exercise
        </Button>
      </VStack>
    </ScrollView>
  )
}
```

## Data Persistence

### Offline-First Strategy

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-netinfo/netinfo'

class DataService {
  private syncQueue: SyncItem[] = []

  async saveWorkout(workout: Workout) {
    // Save locally first
    await this.saveToLocal('workouts', workout)
    
    // Add to sync queue
    this.syncQueue.push({
      action: 'create',
      collection: 'workouts',
      data: workout,
      timestamp: Date.now()
    })

    // Try to sync if online
    if (await this.isOnline()) {
      await this.syncData()
    }
  }

  private async saveToLocal(key: string, data: any) {
    try {
      const existing = await AsyncStorage.getItem(key)
      const items = existing ? JSON.parse(existing) : []
      items.push(data)
      await AsyncStorage.setItem(key, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save to local storage:', error)
    }
  }

  private async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch()
    return netInfo.isConnected === true
  }

  async syncData() {
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue[0]
      
      try {
        await this.syncToServer(item)
        this.syncQueue.shift() // Remove synced item
      } catch (error) {
        console.error('Sync failed:', error)
        break // Stop syncing on error
      }
    }
  }
}
```

## Health Integration

### Apple Health Kit

```typescript
import { AppleHealthKit, HealthKitPermissions } from 'react-native-health'

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
  },
}

export class HealthService {
  static async initialize() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async saveWorkout(workout: Workout) {
    const workoutData = {
      type: 'Strength',
      startDate: workout.startTime,
      endDate: workout.endTime,
      energyBurned: workout.caloriesBurned,
      distance: 0,
    }

    return new Promise((resolve, reject) => {
      AppleHealthKit.saveWorkout(workoutData, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}
```

## Testing Strategy

### Component Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { ExerciseForm } from '../ExerciseForm'

describe('ExerciseForm', () => {
  it('should validate required fields', async () => {
    const mockOnSave = jest.fn()
    
    const { getByText, getByPlaceholderText } = render(
      <ExerciseForm onSave={mockOnSave} />
    )

    const saveButton = getByText('Save Exercise')
    fireEvent.press(saveButton)

    await waitFor(() => {
      expect(getByText('Exercise name is required')).toBeTruthy()
    })
    
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should save exercise with valid data', async () => {
    const mockOnSave = jest.fn()
    
    const { getByText, getByPlaceholderText } = render(
      <ExerciseForm onSave={mockOnSave} />
    )

    fireEvent.changeText(getByPlaceholderText('e.g., Push-ups'), 'Push-ups')
    fireEvent.press(getByText('Save Exercise'))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Push-ups',
          sets: 3,
          reps: 10
        })
      )
    })
  })
})
```

### E2E Testing with Detox

```typescript
describe('Workout Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should complete a workout session', async () => {
    // Navigate to workouts
    await element(by.text('Workouts')).tap()
    
    // Start new workout
    await element(by.text('Start Workout')).tap()
    
    // Add exercise
    await element(by.text('Add Exercise')).tap()
    await element(by.id('exercise-name')).typeText('Push-ups')
    await element(by.text('Save')).tap()
    
    // Complete workout
    await element(by.text('Complete Workout')).tap()
    
    // Verify workout saved
    await expect(element(by.text('Workout completed!'))).toBeVisible()
  })
})
```

## Performance Optimization

### Image Optimization

```typescript
import FastImage from 'react-native-fast-image'

export const OptimizedImage: React.FC<ImageProps> = ({ source, style }) => {
  return (
    <FastImage
      style={style}
      source={{
        uri: source,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  )
}
```

### List Performance

```typescript
import { FlashList } from '@shopify/flash-list'

export const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  const renderWorkout = useCallback(({ item }: { item: Workout }) => (
    <WorkoutCard workout={item} />
  ), [])

  const keyExtractor = useCallback((item: Workout) => item.id, [])

  return (
    <FlashList
      data={workouts}
      renderItem={renderWorkout}
      keyExtractor={keyExtractor}
      estimatedItemSize={120}
      showsVerticalScrollIndicator={false}
    />
  )
}
```

## Deployment

### Expo Build Configuration

```json
{
  "expo": {
    "name": "Fitness Tracker",
    "slug": "fitness-tracker",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.example.fitnesstracker",
      "buildNumber": "1",
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.example.fitnesstracker",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    },
    "plugins": [
      "@react-native-async-storage/async-storage",
      "expo-secure-store"
    ]
  }
}
```

## Future Enhancements

- [ ] Apple Watch companion app
- [ ] Nutrition tracking integration
- [ ] AI-powered workout recommendations
- [ ] Video exercise demonstrations
- [ ] Social challenges and leaderboards

## Links

- **App Store**: [Coming Soon]
- **Google Play**: [Coming Soon]
- **Source Code**: [github.com/username/fitness-app](https://github.com/username/fitness-app)

---

*A modern fitness tracking solution built with React Native and love for fitness.*
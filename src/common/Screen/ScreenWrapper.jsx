import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import useTheme from "../../hooks/useTheme";
import useThemeStore from "../../store/theme.store";

const ScreenWrapper = ({
  children,
  withScroll = false,
  horizontalPadding = 16,
  backgroundColor,
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0,
  scrollViewProps = {},
}) => {
  const colors = useTheme();
  const themeMode = useThemeStore((state) => state.mode);

  const containerStyle = {
    flex: 1,
    backgroundColor: backgroundColor || colors.background,
  };

  const contentStyle = {
    flexGrow: 1,
    paddingHorizontal: horizontalPadding,
  };

  const inner = withScroll ? (
    <ScrollView
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex1, { paddingHorizontal: horizontalPadding }]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar
        barStyle={themeMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor || colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex1}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {inner}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

export default ScreenWrapper;

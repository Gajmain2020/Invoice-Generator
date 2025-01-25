import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import { Button } from '~/components/Button';
import { BusinessEntityType } from '~/schema/invoice';
import { useStore } from '~/store';

function ContactListItem({ contact }: { contact: BusinessEntityType }) {
  const startNewInvoice = useStore((data) => data.startNewInvoice);
  const addRecipientInfo = useStore((data) => data.addRecipientInfo);
  const deleteContact = useStore((data) => data.deleteContact);
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const onNewInvoicePressed = () => {
    startNewInvoice();
    addRecipientInfo(contact);
    router.push('/invoices/generate');
  };

  return (
    <>
      <Animated.View
        entering={FadeIn.duration(500)} // Fade in when the item appears
        exiting={FadeOut.duration(500)} // Fade out when the item is removed
      >
        <TouchableOpacity
          onLongPress={() => {
            setSelectedIndex(contact.id);
            setVisible(true);
          }}
          className="flex-row items-center justify-between rounded-lg bg-white p-4 shadow-md">
          <View>
            <Text className="text-lg font-semibold">{contact.name}</Text>
            <Text className="text-gray-600">{contact.address}</Text>
          </View>
          <View className="flex-row gap-6">
            <FontAwesome6
              onPress={() => {
                router.push(`/contacts/${contact.id}/edit`);
              }}
              name="edit"
              color="dimgray"
              size={20}
            />
            <FontAwesome6
              onPress={onNewInvoicePressed}
              name="file-invoice"
              color="dimgray"
              size={20}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal transparent visible={visible} onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className=" flex-1 items-center justify-center bg-gray-800/50">
            <TouchableWithoutFeedback>
              <Animated.View
                entering={ZoomIn.duration(400)} // Scale the modal in
                exiting={ZoomOut.duration(400)} // Scale the modal out
                className="w-4/5 rounded-lg bg-white p-6 shadow-lg">
                <Text className="mb-4 text-center text-lg font-semibold">Are you sure?</Text>
                <Text className="mb-6 text-center text-gray-500">
                  Do you want to delete contact?
                </Text>
                <View className="flex-row justify-between">
                  <Button
                    className="h-10 flex-1 items-center justify-center py-0 "
                    title="Cancel"
                    variant="link"
                    onPress={() => setVisible(false)}
                  />
                  <Button
                    title="Delete"
                    className="h-10 flex-1 items-center justify-center bg-red-400 py-0"
                    onPress={() => {
                      if (selectedIndex !== null) {
                        deleteContact(contact.id);
                        setSelectedIndex(null);
                      }
                      setVisible(false);
                    }}
                  />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default function ContactScreen() {
  const contacts = useStore((data) => data.contacts);

  if (contacts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-2 text-xl font-bold">No Contacts Yet</Text>
        <Text className="mb-8 text-center text-gray-600">
          Your contacts will appear here after you create invoices.
        </Text>
      </View>
    );
  }

  return (
    <Animated.FlatList
      className="flex-1"
      data={contacts}
      contentContainerClassName="p-2 gap-2"
      keyExtractor={(item, index) => item.name + index}
      renderItem={({ item }) => <ContactListItem contact={item} />}
      entering={SlideInRight.duration(600)} // Slide in the list
      exiting={SlideOutLeft.duration(600)} // Slide out the list
    />
  );
}

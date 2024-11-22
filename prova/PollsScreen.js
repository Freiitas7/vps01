import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { firebase } from '../firebaseConfig';

export default function PollsScreen() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('polls')
      .onSnapshot(snapshot => {
        const pollsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPolls(pollsList);
      });

    return () => unsubscribe();
  }, []);

  const handleVote = async (pollId, option) => {
    const pollRef = firebase.firestore().collection('polls').doc(pollId);
    const pollDoc = await pollRef.get();
    const options = pollDoc.data().options;
    options[option] += 1;
    await pollRef.update({ options });
  };

  return (
    <View>
      {polls.map(poll => (
        <View key={poll.id}>
          <Text>{poll.title}</Text>
          <Button title={`Votar em ${poll.options.option1}`} onPress={() => handleVote(poll.id, 'option1')} />
          <Button title={`Votar em ${poll.options.option2}`} onPress={() => handleVote(poll.id, 'option2')} />
        </View>
      ))}
    </View>
  );
}

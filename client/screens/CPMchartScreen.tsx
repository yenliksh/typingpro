import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GameParticipantDto } from '../api/dtos/GameParticipantDto';
import { SpinnerLoading } from '../components/SpinnerLoading';
import { Text } from '../components/Themed';
import { AuthStore } from '../stores/AuthStore';
import { EStoreKeys, useResolveStore } from '../stores/di';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#342e57',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonBox: {
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#1A143B',
    paddingTop: 7,
    paddingBottom: 9,
    paddingStart: 23,
    paddingEnd: 23,
    borderRadius: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  CPMchart: {
    shadowOffset: {
      width: 2,
      height: -2,
    },
    shadowOpacity: 0.2,
    marginTop: 30,
  },
  innerContainer: {
    marginTop: 40,
    marginHorizontal: 30,
  },
});

export const CPMchartScreen: React.FC<{ navigation: any }> = observer(
  ({ navigation }) => {
    const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
    const [playerGames, setPlayerGames] = useState<GameParticipantDto[]>();
    const screenWidth = Dimensions.get('window').width;
    const dataObject = {
      labels: [''],
      datasets: [
        {
          data: [0],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Cpm'],
    };
    const [data, setData] = useState(dataObject);
    const [loading, setLoading] = useState(false);
    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    useEffect(() => {
      if (authStore?.currentUser?.loading || playerGames === undefined) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [authStore?.currentUser?.loading, playerGames]);

    useEffect(() => {
      AuthStore.getCPMData().then((playerGame) => {
        if (playerGame) {
          setPlayerGames(playerGame);
        }
      });
    }, [authStore]);

    useEffect(() => {
      if (playerGames && playerGames.length > 0) {
        setData({
          labels: playerGames?.map(
            (pg) => `${pg.createdAt.slice(5, 10)}-${pg.createdAt.slice(2, 4)}`
          ),
          datasets: [
            {
              data: playerGames?.map((pg) => pg.cpm),
              // eslint-disable-next-line max-len
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
              strokeWidth: 2, // optional
            },
          ],
          legend: ['Cpm'], // optional
        });
      }
    }, [playerGames]);
    return (
      <View style={styles.container}>
        <SpinnerLoading visible={loading} />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{i18n.t('cpmChart')}</Text>
        </View>
        <LineChart
          style={styles.CPMchart}
          data={data}
          width={screenWidth}
          height={370}
          verticalLabelRotation={70}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    );
  }
);

export default CPMchartScreen;

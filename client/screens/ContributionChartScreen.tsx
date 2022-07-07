import i18n from 'i18n-js';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { TooltipDataAttrs } from 'react-native-chart-kit/dist/contribution-graph/ContributionGraph';
import Toast from 'react-native-root-toast';
import { ContributionDataDto } from '../api/dtos/ContributionDataDto';
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
  ContributionChart: {
    shadowOffset: {
      width: 2,
      height: -2,
    },
    shadowOpacity: 0.2,
    marginTop: 30,
    width: '100%',
  },
  innerContainer: {
    marginTop: 40,
    marginHorizontal: 30,
  },
});

export const ContributionChartScreen: React.FC = observer(() => {
  const authStore = useResolveStore<AuthStore>(EStoreKeys.AuthStoreKey);
  const screenWidth = Dimensions.get('window').width;
  const [commitsData, setCommitsData] = useState<ContributionDataDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authStore?.currentUser?.loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [authStore?.currentUser?.loading]);

  useEffect(() => {
    AuthStore.getContributionData().then((contributionData) => {
      if (contributionData) {
        setCommitsData(contributionData);
      }
    });
  }, [authStore]);

  return (
    <View style={styles.container}>
      <SpinnerLoading visible={loading} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{i18n.t('contributionChart')}</Text>
      </View>
      <ContributionGraph
        style={styles.ContributionChart}
        values={commitsData}
        endDate={new Date()}
        numDays={110}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        tooltipDataAttrs={(() => {}) as unknown as TooltipDataAttrs}
        onDayPress={({ count }) => {
          if (count) {
            Toast.show(`${count} ${i18n.t('gamesTotal')}`);
          }
        }}
      />
    </View>
  );
});

export default ContributionChartScreen;

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

import { ScreenHeaderBtn, NearbyJobCard } from "../components";
import { COLORS, icons, SIZES } from "../constants";
import styles from "../styles/search";

const JobSearch = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // params from navigation
  const { query, jobType } = route.params || {};
  const searchValue = query || jobType;

  const [searchResult, setSearchResult] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    setSearchLoader(true);
    setSearchResult([]);

    try {
      const options = {
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/search`,
        headers: {
          "X-RapidAPI-Key": "", // add your key
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: {
          query: searchValue,
          page: page.toString(),
        },
      };

      const response = await axios.request(options);
      setSearchResult(response.data.data);
    } catch (error) {
      setSearchError(error);
      console.log(error);
    } finally {
      setSearchLoader(false);
    }
  };

  const handlePagination = (direction) => {
    if (direction === "left" && page > 1) {
      setPage((prev) => prev - 1);
    } else if (direction === "right") {
      setPage((prev) => prev + 1);
    }
  };

  // 🔥 important: re-fetch when page changes
  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      
      {/* Custom Header */}
      <View style={{ padding: SIZES.medium }}>
        <ScreenHeaderBtn
          iconUrl={icons.left}
          dimension="60%"
          handlePress={() => navigation.goBack()}
        />
      </View>

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            handleNavigate={() =>
              navigation.navigate("JobDetails", {
                jobId: item.job_id,
              })
            }
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{
          padding: SIZES.medium,
          rowGap: SIZES.medium,
        }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{searchValue}</Text>
              <Text style={styles.noOfSearchedJobs}>
                Job Opportunities
              </Text>
            </View>

            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                />
              ) : searchError ? (
                <Text>Oops something went wrong</Text>
              ) : null}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("left")}
            >
              <Image
                source={icons.chevronLeft}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.paginationTextBox}>
              <Text style={styles.paginationText}>{page}</Text>
            </View>

            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("right")}
            >
              <Image
                source={icons.chevronRight}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default JobSearch;
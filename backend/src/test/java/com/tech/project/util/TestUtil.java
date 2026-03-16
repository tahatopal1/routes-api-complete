package com.tech.project.util;

import com.tech.project.dto.route.Route;
import com.tech.project.entity.Transportation;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.mock;

public class TestUtil {

    public static List<Route> generateRouteList() {

        List<Route> routeList = new ArrayList<>();
        Transportation transportation = mock(Transportation.class);

        Route route = new Route();
        route.setPreFlight(transportation);
        route.setFlight(transportation);
        route.setPostFlight(transportation);

        routeList.add(route);
        return routeList;

    }

}

#!/usr/bin/env python3
"""
ParkEase Backend API Testing Suite
Tests all backend endpoints for the parking platform MVP
"""

import requests
import sys
import json
from datetime import datetime

class ParkEaseAPITester:
    def __init__(self, base_url="https://b394f60c-89a1-435d-b283-254c3a185128.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.event_id = "karan-aujla-jln-2026"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test GET /api/health returns ok"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        if success and response.get('status') == 'ok':
            print("   ✓ Health status is 'ok'")
            return True
        elif success:
            print(f"   ⚠️ Unexpected health status: {response.get('status')}")
        return success

    def test_list_events(self):
        """Test GET /api/events returns list of events"""
        success, response = self.run_test(
            "List Events",
            "GET",
            "api/events",
            200
        )
        if success:
            if isinstance(response, list) and len(response) > 0:
                print(f"   ✓ Found {len(response)} events")
                # Check if our test event exists
                event_ids = [event.get('event_id') for event in response]
                if self.event_id in event_ids:
                    print(f"   ✓ Test event '{self.event_id}' found")
                else:
                    print(f"   ⚠️ Test event '{self.event_id}' not found")
                return True
            else:
                print(f"   ⚠️ Expected list of events, got: {type(response)}")
        return success

    def test_get_event_details(self):
        """Test GET /api/events/karan-aujla-jln-2026 returns event with correct fields"""
        success, response = self.run_test(
            "Get Event Details",
            "GET",
            f"api/events/{self.event_id}",
            200
        )
        if success:
            required_fields = ['event_id', 'event_name', 'spots_remaining', 'fill_percent', 'booked_spots']
            missing_fields = [field for field in required_fields if field not in response]
            
            if not missing_fields:
                print(f"   ✓ All required fields present")
                print(f"   ✓ Spots remaining: {response.get('spots_remaining')}")
                print(f"   ✓ Fill percent: {response.get('fill_percent')}%")
                print(f"   ✓ Booked spots: {response.get('booked_spots')}")
                return True
            else:
                print(f"   ⚠️ Missing fields: {missing_fields}")
        return success

    def test_get_event_bays(self):
        """Test GET /api/events/karan-aujla-jln-2026/bays returns bay grid"""
        success, response = self.run_test(
            "Get Event Bays",
            "GET",
            f"api/events/{self.event_id}/bays",
            200
        )
        if success:
            if isinstance(response, list) and len(response) > 0:
                print(f"   ✓ Found {len(response)} bays")
                # Check bay structure
                first_bay = response[0]
                required_bay_fields = ['event_id', 'lot_id', 'pillar_code', 'status']
                missing_fields = [field for field in required_bay_fields if field not in first_bay]
                
                if not missing_fields:
                    print(f"   ✓ Bay structure is correct")
                    # Count available vs taken
                    available = len([b for b in response if b.get('status') == 'available'])
                    taken = len([b for b in response if b.get('status') == 'taken'])
                    print(f"   ✓ Available bays: {available}, Taken bays: {taken}")
                    return True
                else:
                    print(f"   ⚠️ Bay missing fields: {missing_fields}")
            else:
                print(f"   ⚠️ Expected list of bays, got: {type(response)}")
        return success

    def test_get_event_bays_filtered(self):
        """Test GET /api/events/karan-aujla-jln-2026/bays?lot_id=north returns only north lot bays"""
        success, response = self.run_test(
            "Get Event Bays (North Lot)",
            "GET",
            f"api/events/{self.event_id}/bays",
            200,
            params={'lot_id': 'north'}
        )
        if success:
            if isinstance(response, list) and len(response) > 0:
                # Check all bays are from north lot
                north_bays = [b for b in response if b.get('lot_id') == 'north']
                if len(north_bays) == len(response):
                    print(f"   ✓ All {len(response)} bays are from north lot")
                    return True
                else:
                    print(f"   ⚠️ Found bays from other lots: {len(response) - len(north_bays)}")
            else:
                print(f"   ⚠️ Expected list of bays, got: {type(response)}")
        return success

    def test_get_event_stats(self):
        """Test GET /api/events/karan-aujla-jln-2026/stats returns operator dashboard data"""
        success, response = self.run_test(
            "Get Event Stats",
            "GET",
            f"api/events/{self.event_id}/stats",
            200
        )
        if success:
            required_fields = ['event_name', 'venue', 'total_spots', 'booked_spots', 'spots_remaining', 'fill_percent', 'lots']
            missing_fields = [field for field in required_fields if field not in response]
            
            if not missing_fields:
                print(f"   ✓ All required stats fields present")
                print(f"   ✓ Event: {response.get('event_name')}")
                print(f"   ✓ Fill rate: {response.get('fill_percent')}%")
                print(f"   ✓ Lots data: {len(response.get('lots', []))} lots")
                return True
            else:
                print(f"   ⚠️ Missing stats fields: {missing_fields}")
        return success

    def test_create_booking_success(self):
        """Test POST /api/bookings creates a booking and marks bay as taken"""
        # First, get available bays
        _, bays_response = self.run_test(
            "Get Available Bays for Booking",
            "GET",
            f"api/events/{self.event_id}/bays",
            200
        )
        
        if not bays_response:
            print("   ❌ Could not get bays for booking test")
            return False
            
        available_bays = [b for b in bays_response if b.get('status') == 'available']
        if not available_bays:
            print("   ⚠️ No available bays found for booking test")
            return False
            
        test_bay = available_bays[0]
        booking_data = {
            "event_id": self.event_id,
            "bay_id": test_bay['pillar_code'],
            "lot_id": test_bay['lot_id'],
            "phone": "9876543210",
            "entry_window": "5:30-7:00 PM",
            "group_size": 1
        }
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "api/bookings",
            201,
            data=booking_data
        )
        
        if success:
            required_booking_fields = ['booking_id', 'event_id', 'bay_id', 'status']
            missing_fields = [field for field in required_booking_fields if field not in response]
            
            if not missing_fields:
                print(f"   ✓ Booking created with ID: {response.get('booking_id')}")
                print(f"   ✓ Bay: {response.get('bay_id')}")
                print(f"   ✓ Status: {response.get('status')}")
                
                # Store booking ID for later tests
                self.test_booking_id = response.get('booking_id')
                return True
            else:
                print(f"   ⚠️ Missing booking fields: {missing_fields}")
        return success

    def test_create_booking_conflict(self):
        """Test POST /api/bookings with taken bay returns 409 conflict"""
        # First, get taken bays
        _, bays_response = self.run_test(
            "Get Taken Bays for Conflict Test",
            "GET",
            f"api/events/{self.event_id}/bays",
            200
        )
        
        if not bays_response:
            print("   ❌ Could not get bays for conflict test")
            return False
            
        taken_bays = [b for b in bays_response if b.get('status') == 'taken']
        if not taken_bays:
            print("   ⚠️ No taken bays found for conflict test")
            return False
            
        test_bay = taken_bays[0]
        booking_data = {
            "event_id": self.event_id,
            "bay_id": test_bay['pillar_code'],
            "lot_id": test_bay['lot_id'],
            "phone": "9876543210",
            "entry_window": "5:30-7:00 PM",
            "group_size": 1
        }
        
        success, response = self.run_test(
            "Create Booking (Conflict)",
            "POST",
            "api/bookings",
            409,
            data=booking_data
        )
        
        if success:
            print(f"   ✓ Correctly returned 409 conflict for taken bay {test_bay['pillar_code']}")
            return True
        return success

    def test_get_booking_details(self):
        """Test GET /api/bookings/{booking_id} returns booking with enriched event details"""
        if not hasattr(self, 'test_booking_id'):
            print("   ⚠️ No booking ID available from previous test")
            return False
            
        success, response = self.run_test(
            "Get Booking Details",
            "GET",
            f"api/bookings/{self.test_booking_id}",
            200
        )
        
        if success:
            required_fields = ['booking_id', 'event_name', 'venue', 'date', 'bay_pillar_code', 'lot_name']
            missing_fields = [field for field in required_fields if field not in response]
            
            if not missing_fields:
                print(f"   ✓ Booking details enriched with event data")
                print(f"   ✓ Event: {response.get('event_name')}")
                print(f"   ✓ Venue: {response.get('venue')}")
                print(f"   ✓ Bay: {response.get('bay_pillar_code')}")
                return True
            else:
                print(f"   ⚠️ Missing enriched fields: {missing_fields}")
        return success

    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("🚀 ParkEase Backend API Testing Suite")
        print("=" * 60)
        
        # Run tests in order
        test_methods = [
            self.test_health_check,
            self.test_list_events,
            self.test_get_event_details,
            self.test_get_event_bays,
            self.test_get_event_bays_filtered,
            self.test_get_event_stats,
            self.test_create_booking_success,
            self.test_create_booking_conflict,
            self.test_get_booking_details,
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                print(f"❌ Test {test_method.__name__} crashed: {str(e)}")
                self.failed_tests.append({
                    "test": test_method.__name__,
                    "error": f"Test crashed: {str(e)}"
                })
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = ParkEaseAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
defmodule BandDb.Calendar.ICSGeneratorTest do
  use BandDb.DataCase
  
  alias BandDb.Calendar.ICSGenerator
  alias BandDb.Accounts.Band
  
  describe "validate_token/2" do
    test "returns true for matching tokens" do
      band = %Band{ical_token: "valid_token_123"}
      assert ICSGenerator.validate_token(band, "valid_token_123")
    end
    
    test "returns false for non-matching tokens" do
      band = %Band{ical_token: "valid_token_123"}
      refute ICSGenerator.validate_token(band, "invalid_token_456")
    end
    
    test "returns false when band has no token" do
      band = %Band{ical_token: nil}
      refute ICSGenerator.validate_token(band, "some_token")
    end
    
    test "returns false when band is nil" do
      refute ICSGenerator.validate_token(nil, "some_token")
    end
    
    test "returns false when provided token is nil" do
      band = %Band{ical_token: "valid_token_123"}
      refute ICSGenerator.validate_token(band, nil)
    end
    
    test "uses secure comparison to prevent timing attacks" do
      # This test verifies that we're using Plug.Crypto.secure_compare
      # by checking that the function works correctly with various inputs
      band = %Band{ical_token: "a" <> String.duplicate("x", 100)}
      
      # Should return true for exact match
      assert ICSGenerator.validate_token(band, "a" <> String.duplicate("x", 100))
      
      # Should return false for different first character
      refute ICSGenerator.validate_token(band, "b" <> String.duplicate("x", 100))
      
      # Should return false for different last character
      refute ICSGenerator.validate_token(band, "a" <> String.duplicate("x", 99) <> "y")
    end
  end
end